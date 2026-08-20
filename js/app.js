/**
 * சலூன் ரேடியோ — App Orchestrator
 * Tamil 80s/90s classics only. Handles player + seek bar.
 */

(function () {
  var ICON_PLAY  = '<svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
  var ICON_PAUSE = '<svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
  var ICON_VOL   = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/><path d="M16 9a5 5 0 0 1 0 6"/><path d="M19.364 18.364a9 9 0 0 0 0-12.728"/></svg>';
  var ICON_MUTE  = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/><line x1="22" y1="2" x2="2" y2="22" stroke="currentColor" stroke-width="2"/></svg>';

  var listenerCount = 42;
  var seekInterval  = null;
  var isDragging    = false;

  var $ = function (id) { return document.getElementById(id); };

  var player = new window.RadioPlayer();

  /* ── Seek bar helpers ────────────────────────────────────── */
  function formatTime(sec) {
    if (!isFinite(sec) || sec < 0) return '-:--';
    var m = Math.floor(sec / 60);
    var s = Math.floor(sec % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  function updateSeekUI(currentTime, duration) {
    var pct = (duration > 0) ? (currentTime / duration) * 100 : 0;
    var fill  = $('seek-fill');
    var thumb = $('seek-thumb');
    var cur   = $('time-current');
    var dur   = $('time-duration');
    if (fill)  fill.style.width = pct + '%';
    if (thumb) thumb.style.left = pct + '%';
    if (cur)   cur.textContent  = formatTime(currentTime);
    if (dur)   dur.textContent  = formatTime(duration);
  }

  function startSeekPolling() {
    if (seekInterval) clearInterval(seekInterval);
    seekInterval = setInterval(function () {
      if (isDragging) return;
      var cur = player.getCurrentTime();
      var dur = player.getDuration();
      updateSeekUI(cur, dur);
    }, 500);
  }

  function bindSeekBar() {
    var track = $('seek-track');
    if (!track) return;

    function seekToPos(e) {
      var rect = track.getBoundingClientRect();
      var x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
      var pct = Math.max(0, Math.min(1, x / rect.width));
      var dur = player.getDuration();
      if (dur > 0) {
        var targetTime = pct * dur;
        player.seekTo(targetTime);
        updateSeekUI(targetTime, dur);
      }
    }

    track.addEventListener('mousedown', function (e) {
      isDragging = true;
      seekToPos(e);
      function onMove(e2) { seekToPos(e2); }
      function onUp()     { isDragging = false; document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); }
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup',   onUp);
    });

    track.addEventListener('touchstart', function (e) {
      isDragging = true;
      seekToPos(e);
    }, { passive: true });

    track.addEventListener('touchmove', function (e) {
      seekToPos(e);
    }, { passive: true });

    track.addEventListener('touchend', function () {
      isDragging = false;
    });
  }

  /* ── Track info + play state ─────────────────────────────── */
  function renderTrackInfo(track) {
    if (!track) return;
    var el  = $('current-track-title');
    var mv  = $('current-track-movie');
    var img = $('current-track-cover');
    if (el)  el.textContent  = track.title;
    if (mv)  mv.textContent  = track.movie;
    if (img) img.src         = track.cover || ('https://i.ytimg.com/vi/' + track.youtubeId + '/hqdefault.jpg');
    document.title = track.title + ' — சலூன் ரேடியோ';
    updateSeekUI(0, 0);
  }

  function renderPlayState(isPlaying) {
    var btn = $('play-pause-btn');
    if (btn) btn.innerHTML = isPlaying ? ICON_PAUSE : ICON_PLAY;
    if (isPlaying) startSeekPolling();
    else if (seekInterval) { clearInterval(seekInterval); seekInterval = null; }
  }

  /* ── Listener counter ────────────────────────────────────── */
  function startListenerCounter() {
    setInterval(function () {
      var delta = Math.floor(Math.random() * 5) - 2;
      listenerCount = Math.max(28, Math.min(72, listenerCount + delta));
      var el = $('listener-count');
      if (el) el.textContent = listenerCount;
    }, 7000);
  }

  /* ── Keyboard shortcuts ──────────────────────────────────── */
  function bindKeyboard() {
    window.addEventListener('keydown', function (e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.code === 'Space')      { e.preventDefault(); player.togglePlay(); }
      else if (e.code === 'ArrowRight') player.nextTrack();
      else if (e.code === 'ArrowLeft')  player.previousTrack();
      else if (e.code === 'KeyM')  { var m = $('mute-btn'); if (m) m.click(); }
    });
  }

  /* ── Boot ────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    var tracks = window.SaloonTracks.getTracks();
    player.setPlaylist(tracks);
    player.loadTrack(0, false);

    player.onTrackChange = renderTrackInfo;
    player.onStateChange = renderPlayState;

    // Controls
    var playBtn = $('play-pause-btn');
    var prevBtn = $('prev-track-btn');
    var nextBtn = $('next-track-btn');
    var muteBtn = $('mute-btn');

    if (playBtn) playBtn.addEventListener('click', function () { player.togglePlay(); });
    if (prevBtn) prevBtn.addEventListener('click', function () { player.previousTrack(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { player.nextTrack(); });
    if (muteBtn) {
      muteBtn.addEventListener('click', function () {
        var muted = player.toggleMute();
        muteBtn.innerHTML = muted ? ICON_MUTE : ICON_VOL;
      });
    }

    bindSeekBar();
    startListenerCounter();
    bindKeyboard();
  });
})();
