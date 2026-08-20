/**
 * சலூன் ரேடியோ — Track & Playlist Engine
 * Supports YouTube Playlists (playlist URL or ID) as well as curated track lists.
 */

(function () {
  function parseYtId(url) {
    if (!url || typeof url !== 'string') return null;
    url = url.trim();
    // Direct 11-char ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
    // Standard YouTube URL formats
    var match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))([\w-]{11})/);
    return match ? match[1] : null;
  }

  function parsePlaylistId(url) {
    if (!url || typeof url !== 'string') return null;
    url = url.trim();
    if (!url) return null;
    // Look for ?list= or &list= in YouTube/YT Music URLs
    var match = url.match(/[?&]list=([a-zA-Z0-9_-]+)/);
    if (match) return match[1];
    // If user directly pasted a playlist ID (e.g. starting with PL, RD, OLAK, etc.)
    if (/^[a-zA-Z0-9_-]{10,}$/.test(url) && !url.includes('/')) {
      return url;
    }
    return null;
  }

  function normalizeTracks(list) {
    if (!Array.isArray(list)) return [];
    return list.map(function (t, idx) {
      if (typeof t === 'string') {
        var yt = parseYtId(t);
        return yt ? {
          title: 'பாடல் ' + (idx + 1),
          movie: 'சலூன் ரேடியோ',
          youtubeId: yt,
          cover: 'https://i.ytimg.com/vi/' + yt + '/hqdefault.jpg'
        } : null;
      }
      if (!t || typeof t !== 'object') return null;
      var ytId = parseYtId(t.youtubeId || t.url || t.link || '');
      if (!ytId) return null;
      return {
        title:    t.title || 'தமிழ் பாடல்',
        movie:    t.movie || t.film || t.album || 'சலூன் ரேடியோ',
        youtubeId: ytId,
        cover:    t.cover || ('https://i.ytimg.com/vi/' + ytId + '/hqdefault.jpg')
      };
    }).filter(Boolean);
  }

  function getPlaylistInfo() {
    var config = window.SALOON_CONFIG || {};
    var playlistUrl = config.youtubePlaylistUrl || config.playlistUrl || config.playlist || '';
    var playlistId = parsePlaylistId(playlistUrl);

    var customTracks = normalizeTracks(config.youtubeLinks || config.customTracks || []);
    var curated80s = normalizeTracks(config.tamil80s || []);
    var curated90s = normalizeTracks(config.tamil90s || config.tamilTracks || []);
    var allTracks = customTracks.concat(curated80s).concat(curated90s);

    return {
      playlistId: playlistId,
      tracks: allTracks
    };
  }

  window.SaloonTracks = {
    getTracks: function () {
      return getPlaylistInfo().tracks;
    },
    getPlaylistInfo: getPlaylistInfo,
    parsePlaylistId: parsePlaylistId,
    parseYtId: parseYtId
  };
})();
