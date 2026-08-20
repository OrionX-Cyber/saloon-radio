/**
 * Deluxe Saloon — Radio Player Engine
 * YouTube IFrame API audio player supporting both YouTube Playlists and individual tracks.
 */

(function () {
  class RadioPlayer {
    constructor() {
      this.ytPlayer = null;
      this.isYTReady = false;
      this.isPlaying = false;
      this.isMuted = false;
      this.volume = 0.85;

      this.playlistId = null; // YouTube playlist ID if playing a native YT playlist
      this.playlist = [];     // Array of track objects if playing manual track list
      this.currentIndex = 0;
      this.currentTrack = null;

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
          playsinline: 1,
          origin: window.location.origin || '*'
        },
        events: {
          onReady: () => {
            this.isYTReady = true;
            if (this.ytPlayer && typeof this.ytPlayer.setVolume === 'function') {
              this.ytPlayer.setVolume(this.volume * 100);
            }
            if (this.playlistId) {
              if (typeof this.ytPlayer.cuePlaylist === 'function') {
                this.ytPlayer.cuePlaylist({
                  list: this.playlistId,
                  listType: 'playlist'
                });
              }
            } else if (this.playlist && this.playlist.length > 0) {
              this.loadTrack(this.currentIndex, false);
            }
          },
          onStateChange: (event) => {
            // YT.PlayerState: -1 (UNSTARTED), 0 (ENDED), 1 (PLAYING), 2 (PAUSED), 3 (BUFFERING), 5 (CUED)
            if (event.data === 1) { // PLAYING
              this.isPlaying = true;
              this.syncCurrentVideoData();
              if (this.onStateChange) this.onStateChange(true);
            } else if (event.data === 2) { // PAUSED
              this.isPlaying = false;
              if (this.onStateChange) this.onStateChange(false);
            } else if (event.data === 0) { // ENDED
              this.nextTrack();
            } else if (event.data === -1 || event.data === 5) { // CUED or UNSTARTED
              this.syncCurrentVideoData();
            }
          },
          onError: (event) => {
            // 2: Invalid param, 100: Not found, 101/150: Embedding not allowed -> Auto-skip!
            console.warn('Saloon Radio player error code:', event.data, '— skipping to next track.');
            setTimeout(() => this.nextTrack(), 500);
          }
        }
      });
    }

    syncCurrentVideoData() {
      if (!this.ytPlayer || typeof this.ytPlayer.getVideoData !== 'function') return;
      const data = this.ytPlayer.getVideoData();
      if (data && (data.title || data.video_id)) {
        const videoId = data.video_id || '';
        const title = data.title || (this.currentTrack ? this.currentTrack.title : 'தமிழ் பாடல்');
        const author = data.author || (this.currentTrack ? this.currentTrack.movie : 'சலூன் ரேடியோ');
        const cover = videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : '';

        const updatedTrack = {
          title: title,
          movie: author,
          youtubeId: videoId,
          cover: cover
        };
        this.currentTrack = updatedTrack;
        if (this.onTrackChange) this.onTrackChange(updatedTrack);
      }
    }

    setYouTubePlaylist(playlistId) {
      this.playlistId = playlistId;
      if (this.isYTReady && this.ytPlayer && typeof this.ytPlayer.cuePlaylist === 'function') {
        this.ytPlayer.cuePlaylist({
          list: playlistId,
          listType: 'playlist'
        });
      }
    }

    setPlaylist(tracks) {
      this.playlistId = null;
      this.playlist = tracks || [];
      if (this.currentIndex >= this.playlist.length) {
        this.currentIndex = 0;
      }
    }

    loadTrack(index, autoPlay = true) {
      if (this.playlistId) {
        // If in YouTube playlist mode
        if (this.isYTReady && this.ytPlayer) {
          if (typeof this.ytPlayer.playVideoAt === 'function') {
            this.ytPlayer.playVideoAt(index);
          } else if (autoPlay) {
            this.ytPlayer.playVideo();
          }
        }
        return;
      }

      if (!this.playlist || this.playlist.length === 0) return;
      if (index < 0) index = this.playlist.length - 1;
      if (index >= this.playlist.length) index = 0;

      this.currentIndex = index;
      this.currentTrack = this.playlist[index];

      if (this.currentTrack && this.currentTrack.youtubeId && this.isYTReady && this.ytPlayer && typeof this.ytPlayer.loadVideoById === 'function') {
        if (autoPlay) {
          this.ytPlayer.loadVideoById({ videoId: this.currentTrack.youtubeId });
          this.isPlaying = true;
        } else {
          this.ytPlayer.cueVideoById({ videoId: this.currentTrack.youtubeId });
          this.isPlaying = false;
        }
      }

      if (this.onTrackChange) this.onTrackChange(this.currentTrack);
      if (this.onStateChange) this.onStateChange(this.isPlaying);
    }

    play() {
      if (this.isYTReady && this.ytPlayer && typeof this.ytPlayer.playVideo === 'function') {
        this.ytPlayer.playVideo();
        this.isPlaying = true;
        if (this.onStateChange) this.onStateChange(true);
      } else if (!this.playlistId && this.playlist.length > 0 && !this.currentTrack) {
        this.loadTrack(0, true);
      }
    }

    pause() {
      if (this.isYTReady && this.ytPlayer && typeof this.ytPlayer.pauseVideo === 'function') {
        this.ytPlayer.pauseVideo();
        this.isPlaying = false;
        if (this.onStateChange) this.onStateChange(false);
      }
    }

    togglePlay() {
      if (this.isPlaying) {
        this.pause();
      } else {
        this.play();
      }
    }

    nextTrack() {
      if (this.playlistId && this.isYTReady && this.ytPlayer && typeof this.ytPlayer.nextVideo === 'function') {
        this.ytPlayer.nextVideo();
      } else if (this.playlist && this.playlist.length > 0) {
        this.loadTrack(this.currentIndex + 1, true);
      }
    }

    previousTrack() {
      if (this.playlistId && this.isYTReady && this.ytPlayer && typeof this.ytPlayer.previousVideo === 'function') {
        this.ytPlayer.previousVideo();
      } else if (this.playlist && this.playlist.length > 0) {
        this.loadTrack(this.currentIndex - 1, true);
      }
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
