/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║        சலூன் ரேடியோ — TAMIL PLAYLIST CONFIGURATION             ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * ┌─────────────────────────────────────────────────────────────────┐
 * │  HOW TO ADD YOUR OWN YOUTUBE PLAYLIST OR SONGS                  │
 * │                                                                 │
 * │  METHOD 1 — Add individual songs (recommended):                 │
 * │    Copy one { ... } block and paste it below the last entry.    │
 * │    Fill in title, movie, and youtubeId.                         │
 * │                                                                 │
 * │    YouTube Video URL example:                                   │
 * │    https://www.youtube.com/watch?v=wDq9aF-3j3M                  │
 * │                                            ^^^^^^^^^^^          │
 * │                              youtubeId = "wDq9aF-3j3M"         │
 * │                                                                 │
 * │  METHOD 2 — Add a YouTube Playlist (paste link here):           │
 * │    In the youtubePlaylistUrl field below, paste a playlist URL. │
 * │    The radio will play the first video from that playlist.      │
 * │    Example: https://www.youtube.com/playlist?list=PLxxx...      │
 * │                                                                 │
 * │  ⚠️  SPOTIFY / YT MUSIC NOTE:                                   │
 * │    Spotify and YouTube Music use DRM-protected streams that     │
 * │    cannot be embedded in a webpage directly. To use songs from  │
 * │    those platforms, find the same song on YouTube, copy the     │
 * │    video URL, and use the youtubeId from that URL.             │
 * │    (Search: "song name official audio" on youtube.com)          │
 * └─────────────────────────────────────────────────────────────────┘
 */

(function () {
  window.SALOON_CONFIG = {

    /* ════════════════════════════════════════════════════════════
       ▶▶  PASTE YOUR YOUTUBE PLAYLIST URL HERE (optional)
       Leave as empty string "" if you are adding songs manually.
       ════════════════════════════════════════════════════════════ */
    youtubePlaylistUrl: '',
    // EXAMPLE: youtubePlaylistUrl: 'https://www.youtube.com/playlist?list=PLxxxxxxxxxxxxxxxxx',


    /* ════════════════════════════════════════════════════════════
       🎶  TAMIL 80s CLASSICS  (எண்பதுகளின் இசை)
       ════════════════════════════════════════════════════════════ */
    tamil80s: [
      {
        title: 'Thendral Vandhu Ennai Thodum',
        movie: 'Thendrale Ennai Thodu (1985)',
        youtubeId: 'EaWc3N9y31s'
      },
      {
        title: 'Poo Poova Pookudhae',
        movie: 'Agni Natchathiram (1988)',
        youtubeId: 'KsHOkBnlwsc'
      },
      {
        title: 'En Iniya Pon Nilave',
        movie: 'Ninaithale Inikkum (1979)',
        youtubeId: 'GHlMmRMDqpM'
      },
      {
        title: 'Ennai Kaadhal Seivai',
        movie: 'Vijayakanth Classics (1988)',
        youtubeId: 'wDq9aF-3j3M'
      },
      {
        title: 'Mella Thiranthathu Kadhavu',
        movie: 'Mella Thiranthathu Kadhavu (1986)',
        youtubeId: 'oZnM7OXNGRU'
      },
      {
        title: 'Kannamoochi Yenada',
        movie: 'Kaadhal Oviyam (1981)',
        youtubeId: '6YCy6eRHFkw'
      },
      {
        title: 'Ninaive Oru Sangeetham',
        movie: 'Mouna Raagam (1986)',
        youtubeId: 'A7IkS2tnzUU'
      },
      {
        title: 'Muthal Mariyathai',
        movie: 'Muthal Mariyathai (1985)',
        youtubeId: 'jHTLYbhH3TU'
      },
      {
        title: 'Ilamai Itho Itho',
        movie: 'Pagal Nilavu (1985)',
        youtubeId: 'zdqL7uMaBIA'
      },
      {
        title: 'Adi Raajakumari',
        movie: 'Aarilirunthu Arubathu Varai (1979)',
        youtubeId: 'TPNmGKAW50c'
      }
      // ← Paste more 80s Tamil tracks here ↑
    ],


    /* ════════════════════════════════════════════════════════════
       🎞️  TAMIL 90s CLASSICS  (தொண்ணூறுகளின் இசை)
       ════════════════════════════════════════════════════════════ */
    tamil90s: [
      {
        title: 'Rakkamma Kaiya Thattu',
        movie: 'Thalapathi (1991)',
        youtubeId: 'wDq9aF-3j3M'
      },
      {
        title: 'Chinna Chinna Aasai',
        movie: 'Roja (1992)',
        youtubeId: 'oGOBRoSGQvs'
      },
      {
        title: 'Kadhal Rojave',
        movie: 'Roja (1992)',
        youtubeId: 'cZ5ZFGBV8O0'
      },
      {
        title: 'Muthu Muthu',
        movie: 'Michael Madhana Kama Rajan (1990)',
        youtubeId: 'w7Iw_9XkGP4'
      },
      {
        title: 'Nila Kaayudhae',
        movie: 'Alaipayuthe (2000)',
        youtubeId: 'B2cqxUCDPSM'
      },
      {
        title: 'Poove Poochudava',
        movie: 'Poove Poochudava (1995)',
        youtubeId: 'wZ36e09p-m8'
      },
      {
        title: 'Unnai Naan Santhithen',
        movie: 'Indira (1995)',
        youtubeId: '2Vv-BfVoq4g'
      },
      {
        title: 'Uyire Uyire',
        movie: 'Bombay (1995)',
        youtubeId: 'UgCITkm1hGc'
      },
      {
        title: 'Kannalanae',
        movie: 'Bombay (1995)',
        youtubeId: 'PiDlU3v-_5A'
      },
      {
        title: 'Kaadhal Sadugudu',
        movie: 'Alaipayuthe (2000)',
        youtubeId: 'sLwh5IfBEMM'
      },
      {
        title: 'Mannvanaa Kalaigaa',
        movie: 'Baasha (1995)',
        youtubeId: 'FMqXhb2GQBM'
      },
      {
        title: 'Kanavil Oru Kaathal',
        movie: 'Kizhakku Cheemayile (1993)',
        youtubeId: 'wepGigjGl2g'
      },
      {
        title: 'Sundari Neeyum Sundaran Naanum',
        movie: 'Gentleman (1993)',
        youtubeId: 'JuqMUPBE2nQ'
      },
      {
        title: 'Pookal Pookum',
        movie: 'Kaadhalan (1994)',
        youtubeId: 'fR5s1GdO5xQ'
      },
      {
        title: 'Keladi Kanmani',
        movie: 'Keladi Kanmani (1990)',
        youtubeId: 'n3h0tqnr1kM'
      }
      // ← Paste more 90s Tamil tracks here ↑
    ]

  };
})();
