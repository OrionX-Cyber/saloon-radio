/**
 * Deluxe Saloon — Minimal Radio Player Engine
 * YouTube IFrame API audio player with seek, volume, and playback controls
 */

(function () {
  class RadioPlayer {
    constructor() {
      this.ytPlayer = null;
      this.isYTReady = false;
      this.isPlaying = false;
      this.isMuted = false;
      this.volume = 0.8;

      this.currentTrack = null;
      this.playlist = [];
      this.currentIndex = 0;

      this.onTrackChange = null;
      this.onStateChange = null;

      this.initYouTubeAPI();
    }

    initYouTubeAPI() {
      if (window.YT && window.YT.Player) {
        this.createYTPlayer();
      } else {
        const prevHandler = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => {
          if (prevHandler) prevHandler();
          this.createYTPlayer();
        };

        if (!document.getElementById('yt-iframe-sdk')) {
          const tag = document.createElement('script');
          tag.id = 'yt-iframe-sdk';
          tag.src = 'https://www.youtube.com/iframe_api';
          document.head.appendChild(tag);
        }
      }
    }

    createYTPlayer() {
      const container = document.getElementById('yt-player-container');
      if (!container) return;

      this.ytPlayer = new window.YT.Player('yt-player-container', {
        height: '1',
        width: '1',
        videoId: '',
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          playsinline: 1
        },
        events: {
          onReady: () => {
            this.isYTReady = true;
            if (this.ytPlayer && typeof this.ytPlayer.setVolume === 'function') {
              this.ytPlayer.setVolume(this.volume * 100);
            }
          },
          onStateChange: (event) => {
            if (event.data === 0) { // ENDED
              this.nextTrack();
            }
          }
        }
      });
    }

    setPlaylist(tracks) {
      this.playlist = tracks || [];
      if (this.currentIndex >= this.playlist.length) {
        this.currentIndex = 0;
      }
    }

    loadTrack(index, autoPlay = true) {
      if (!this.playlist || this.playlist.length === 0) return;
      if (index < 0) index = this.playlist.length - 1;
      if (index >= this.playlist.length) index = 0;

      this.currentIndex = index;
      this.currentTrack = this.playlist[index];

      if (this.currentTrack && this.currentTrack.youtubeId && this.isYTReady && this.ytPlayer && typeof this.ytPlayer.loadVideoById === 'function') {
        this.ytPlayer.loadVideoById({ videoId: this.currentTrack.youtubeId });
        if (autoPlay) {
          this.ytPlayer.playVideo();
          this.isPlaying = true;
        }
      }

      if (this.onTrackChange) this.onTrackChange(this.currentTrack);
      if (this.onStateChange) this.onStateChange(this.isPlaying);
    }

    play() {
      if (!this.currentTrack && this.playlist.length > 0) {
        this.loadTrack(0, true);
        return;
      }
      if (this.currentTrack && this.currentTrack.youtubeId && this.isYTReady && this.ytPlayer && typeof this.ytPlayer.playVideo === 'function') {
        this.ytPlayer.playVideo();
      }
      this.isPlaying = true;
      if (this.onStateChange) this.onStateChange(true);
    }

    pause() {
      if (this.ytPlayer && typeof this.ytPlayer.pauseVideo === 'function') {
        this.ytPlayer.pauseVideo();
      }
      this.isPlaying = false;
      if (this.onStateChange) this.onStateChange(false);
    }

    togglePlay() {
      if (this.isPlaying) {
        this.pause();
      } else {
        this.play();
      }
    }

    nextTrack() {
      this.loadTrack(this.currentIndex + 1, true);
    }

    previousTrack() {
      this.loadTrack(this.currentIndex - 1, true);
    }

    toggleMute() {
      this.isMuted = !this.isMuted;
      if (this.ytPlayer && typeof this.ytPlayer.mute === 'function') {
        if (this.isMuted) this.ytPlayer.mute();
        else this.ytPlayer.unMute();
      }
      return this.isMuted;
    }

    seekTo(seconds) {
      if (this.ytPlayer && typeof this.ytPlayer.seekTo === 'function') {
        this.ytPlayer.seekTo(seconds, true);
      }
    }

    getCurrentTime() {
      if (this.ytPlayer && typeof this.ytPlayer.getCurrentTime === 'function') {
        return this.ytPlayer.getCurrentTime() || 0;
      }
      return 0;
    }

    getDuration() {
      if (this.ytPlayer && typeof this.ytPlayer.getDuration === 'function') {
        return this.ytPlayer.getDuration() || 0;
      }
      return 0;
    }
  }

  window.RadioPlayer = RadioPlayer;
})();
