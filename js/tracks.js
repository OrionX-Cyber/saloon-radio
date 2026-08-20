/**
 * சலூன் ரேடியோ — Track Engine
 * Merges tamil80s + tamil90s from js/config.js into a single playlist.
 */

(function () {
  function parseYtId(url) {
    if (!url) return null;
    var match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : null;
  }

  function normalize(list) {
    return (list || []).map(function (t) {
      var ytId = t.youtubeId || parseYtId(t.url || '');
      return {
        title:    t.title || 'தெரியாத பாடல்',
        movie:    t.movie || '',
        youtubeId: ytId   || '',
        cover:    t.cover  || (ytId ? 'https://i.ytimg.com/vi/' + ytId + '/hqdefault.jpg' : '')
      };
    }).filter(function (t) { return t.youtubeId; });
  }

  function getTracks() {
    var config = window.SALOON_CONFIG || {};
    // Merge 80s + 90s into one playlist
    var all = (config.tamil80s || []).concat(config.tamil90s || config.tamilTracks || []);
    return normalize(all);
  }

  window.SaloonTracks = { getTracks: getTracks };
})();
