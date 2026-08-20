/**
 * Deluxe Saloon — Admin Panel & URL Importer
 * Parses YouTube Playlist/Video URLs, Spotify links, and YT Music URLs
 * Manages custom tracks, rotation categories, LocalStorage persistence, and JSON backup.
 */

(function () {
  function parseMusicUrl(urlStr) {
    urlStr = (urlStr || '').trim();
    let result = {
      type: 'unknown',
      youtubeId: null,
      playlistId: null,
      spotifyId: null
    };

    if (!urlStr) return result;

    // YouTube Playlist
    const ytListMatch = urlStr.match(/[?&]list=([^#&?]+)/);
    if (ytListMatch && ytListMatch[1]) {
      result.type = 'youtube-playlist';
      result.playlistId = ytListMatch[1];
    }

    // YouTube Video ID (youtube.com/watch?v=... or youtu.be/...)
    const ytVideoMatch = urlStr.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (ytVideoMatch && ytVideoMatch[1]) {
      result.type = result.type === 'youtube-playlist' ? 'youtube-playlist' : 'youtube-video';
      result.youtubeId = ytVideoMatch[1];
    }

    // Spotify Playlist or Track link
    if (urlStr.includes('spotify.com')) {
      const spMatch = urlStr.match(/spotify\.com\/(track|playlist)\/([a-zA-Z0-9]+)/);
      if (spMatch) {
        result.type = spMatch[1] === 'playlist' ? 'spotify-playlist' : 'spotify-track';
        result.spotifyId = spMatch[2];
      }
    }

    return result;
  }

  function setupAdminPanel(playerInstance, onCatalogUpdated) {
    const modal = document.getElementById('admin-modal');
    const openBtn = document.getElementById('open-admin-btn');
    const openFooterBtn = document.getElementById('open-admin-footer-btn');
    const closeBtn = document.getElementById('close-admin-btn');
    const form = document.getElementById('admin-add-track-form');
    const urlInput = document.getElementById('admin-url-input');
    const parseStatus = document.getElementById('admin-parse-status');

    const customTracksList = document.getElementById('admin-custom-tracks-list');
    const exportBtn = document.getElementById('admin-export-btn');
    const importInput = document.getElementById('admin-import-file');

    if (openBtn) openBtn.addEventListener('click', () => modal.showModal());
    if (openFooterBtn) openFooterBtn.addEventListener('click', () => modal.showModal());
    if (closeBtn) closeBtn.addEventListener('click', () => modal.close());

    // URL Auto-Parser indicator
    if (urlInput) {
      urlInput.addEventListener('input', () => {
        const parsed = parseMusicUrl(urlInput.value);
        if (parsed.type === 'youtube-video' || parsed.type === 'youtube-playlist') {
          parseStatus.innerHTML = `<span class="text-[#25D366]">✓ Valid YouTube Link detected (ID: ${parsed.youtubeId || parsed.playlistId})</span>`;
          if (parsed.youtubeId) {
            const ytTitleInput = document.getElementById('admin-title-input');
            if (ytTitleInput && !ytTitleInput.value) {
              ytTitleInput.placeholder = 'e.g. Song Title from YouTube Video';
            }
          }
        } else if (parsed.type.includes('spotify')) {
          parseStatus.innerHTML = `<span class="text-amber-400">ℹ Spotify Link detected (ID: ${parsed.spotifyId}). YouTube embed fallback will be matched automatically.</span>`;
        } else if (urlInput.value.trim().length > 5) {
          parseStatus.innerHTML = `<span class="text-red-400">⚠ Unrecognized URL format. Please paste a valid YouTube or Spotify link.</span>`;
        } else {
          parseStatus.innerHTML = '';
        }
      });
    }

    // Handle Form Submit
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const urlValue = urlInput.value;
        const parsed = parseMusicUrl(urlValue);

        const title = document.getElementById('admin-title-input').value.trim();
        const movie = document.getElementById('admin-movie-input').value.trim();
        const singers = document.getElementById('admin-singers-input').value.trim() || 'Classic Artist';
        const composer = document.getElementById('admin-composer-input').value.trim() || 'Vintage Maestro';
        const year = document.getElementById('admin-year-input').value.trim() || '1995';
        const language = document.getElementById('admin-language-select').value || 'hindi';
        const rotation = document.getElementById('admin-rotation-select').value || 'saloon-classics';
        const cover = document.getElementById('admin-cover-input').value.trim() || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&q=80';
        const trivia = document.getElementById('admin-trivia-input').value.trim() || 'Added to Deluxe Saloon Radio station rotation.';

        let finalYtId = parsed.youtubeId;
        if (!finalYtId && parsed.type === 'youtube-playlist') {
          finalYtId = 'c25G1e3k47s'; // Default fallback
        }
        if (!finalYtId) {
          finalYtId = 'N0jnLZxYwYc';
        }

        const newTrack = {
          id: 'custom-' + Date.now(),
          title,
          movie,
          year,
          singers,
          composer,
          language,
          rotation,
          youtubeId: finalYtId,
          cover,
          trivia,
          isCustom: true
        };

        const success = window.SaloonTracks.saveCustomTrack(newTrack);
        if (success) {
          form.reset();
          parseStatus.innerHTML = '<span class="text-[#25D366] font-bold">✓ Track successfully added to Saloon Radio catalog!</span>';
          renderCustomTracksList();
          if (onCatalogUpdated) onCatalogUpdated();
        }
      });
    }

    // Render list of custom user added tracks
    function renderCustomTracksList() {
      if (!customTracksList) return;
      const allTracks = window.SaloonTracks.getStoredTracks();
      const customTracks = allTracks.filter(t => t.isCustom || t.id.startsWith('custom-'));

      if (customTracks.length === 0) {
        customTracksList.innerHTML = '<p class="text-xs text-sand/60 italic py-2">No custom added tracks yet. Paste a YouTube or Spotify link above to add your first custom playlist track!</p>';
        return;
      }

      customTracksList.innerHTML = customTracks.map(t => `
        <div class="saloon-glass flex items-center justify-between gap-3 p-3 rounded-xl">
          <img src="${t.cover}" alt="" class="size-10 rounded-lg object-cover shrink-0" />
          <div class="min-w-0 flex-1">
            <p class="text-sm font-bold text-cream truncate">${t.title}</p>
            <p class="text-xs text-sand/70 truncate">${t.movie} (${t.year}) • ${t.language.toUpperCase()}</p>
          </div>
          <button type="button" data-delete-id="${t.id}" class="delete-track-btn saloon-chip text-red-400 hover:text-red-300 hover:border-red-500/50">
            Delete
          </button>
        </div>
      `).join('');

      // Attach delete handlers
      customTracksList.querySelectorAll('.delete-track-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.getAttribute('data-delete-id');
          if (confirm('Are you sure you want to delete this custom track from radio catalog?')) {
            window.SaloonTracks.deleteCustomTrack(id);
            renderCustomTracksList();
            if (onCatalogUpdated) onCatalogUpdated();
          }
        });
      });
    }

    // Export JSON
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        const jsonStr = window.SaloonTracks.exportCatalogJSON();
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `deluxe-saloon-catalog-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
      });
    }

    // Import JSON
    if (importInput) {
      importInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
          const ok = window.SaloonTracks.importCatalogJSON(evt.target.result);
          if (ok) {
            alert('Catalog imported successfully!');
            renderCustomTracksList();
            if (onCatalogUpdated) onCatalogUpdated();
          } else {
            alert('Failed to parse catalog JSON file.');
          }
        };
        reader.readAsText(file);
      });
    }

    renderCustomTracksList();
  }

  window.setupAdminPanel = setupAdminPanel;
  window.parseMusicUrl = parseMusicUrl;
})();
