(function() {
  'use strict';
  
  /**
   * Background Audio Player Module
   * --------------------------------
   * This module tries to play a SoundCloud track (https://soundcloud.com/kvnbbg/rain-1)
   * in the background. It loops and auto‑plays the track. If the track fails to play
   * (e.g., due to autoplay restrictions, network or CORS issues), the script will fall
   * back to displaying a FreeSound embed.
   *
   * Primary Audio Source: SoundCloud (the URL should point to a playable audio stream)
   * Fallback Embed Source: FreeSound
   * Fallback Embed HTML: 
   *   <iframe frameborder="0" scrolling="no" src="https://freesound.org/embed/sound/iframe/773195/simple/small/" width="375" height="30"></iframe>
   *
   * This module is independent and can be added to any webpage regardless of design.
   */

  // Define constants for primary and fallback sources.
  const SOUND_CLOUD_URL = 'https://soundcloud.com/kvnbbg/rain-1';
  const FREE_SOUND_EMBED_HTML = '<iframe frameborder="0" scrolling="no" src="https://freesound.org/embed/sound/iframe/773195/simple/small/" width="375" height="30"></iframe>';

  // Ensure there is a fallback container; if not, create one.
  let fallbackContainer = document.getElementById('fallbackAudio');
  if (!fallbackContainer) {
    fallbackContainer = document.createElement('div');
    fallbackContainer.id = 'fallbackAudio';
    // Optional inline styling – adjust or override via external CSS as needed.
    fallbackContainer.style.position = 'fixed';
    fallbackContainer.style.bottom = '10px';
    fallbackContainer.style.left = '10px';
    fallbackContainer.style.zIndex = '1000';
    fallbackContainer.style.width = '100%';
    fallbackContainer.style.maxWidth = '375px';
    document.body.appendChild(fallbackContainer);
  }

  // Create an Audio object for the SoundCloud track.
  let audioPlayer = new Audio();
  audioPlayer.src = SOUND_CLOUD_URL;
  audioPlayer.loop = true;     // Enable continuous looping.
  audioPlayer.autoplay = true; // Request auto-play when possible.
  audioPlayer.volume = 1.0;    // Set initial volume (range: 0.0 to 1.0).

  /**
   * attemptPlayback
   * ----------------
   * Tries to play the audio. Returns a Promise that resolves if playback starts,
   * or rejects if an error occurs.
   *
   * @returns {Promise} A promise representing the playback attempt.
   */
  function attemptPlayback() {
    return audioPlayer.play();
  }

  /**
   * activateFallback
   * -----------------
   * Inserts the FreeSound embed into the fallback container as an alternative audio method.
   */
  function activateFallback() {
    console.error('SoundCloud playback failed. Activating FreeSound fallback.');
    fallbackContainer.innerHTML = FREE_SOUND_EMBED_HTML;
  }

  /**
   * handlePlayback
   * --------------
   * Initiates playback and handles errors by activating the fallback method.
   */
  function handlePlayback() {
    attemptPlayback().catch(function(error) {
      console.error('Playback attempt failed:', error);
      activateFallback();
    });
  }

  // Event: When the audio is ready to play, try starting playback.
  audioPlayer.addEventListener('canplay', function() {
    handlePlayback();
  });

  // Event: If an error occurs during audio loading or playback, switch to the fallback.
  audioPlayer.addEventListener('error', function(errorEvent) {
    console.error('Error during SoundCloud audio playback:', errorEvent);
    activateFallback();
  });

  // Extra safeguard: Attempt to start playback once the window has fully loaded.
  window.addEventListener('load', function() {
    handlePlayback();
  });

  // Periodically check whether the audio is paused. If it is and no fallback is active,
  // reattempt playback to force the audio to run.
  setInterval(function() {
    if (audioPlayer.paused && !fallbackContainer.innerHTML) {
      console.log('Audio is paused. Reattempting playback.');
      handlePlayback();
    }
  }, 10000); // Check every 10 seconds.

})();
