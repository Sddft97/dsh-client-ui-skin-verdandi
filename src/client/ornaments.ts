/** Original vector ornaments for the Rose Ridge Vow presentation. */

function svgDataUri(source: string): string {
  return `data:image/svg+xml,${encodeURIComponent(source)}`
}

export const HEADER_VEIL = svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 76" preserveAspectRatio="none">
  <defs>
    <linearGradient id="veil" x1="0" y1="0" x2="0" y2="1">
      <stop stop-color="#fffdfb" stop-opacity=".99"/>
      <stop offset="1" stop-color="#f9f1eb" stop-opacity=".96"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-30%" width="140%" height="170%">
      <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#55202d" flood-opacity=".18"/>
    </filter>
    <pattern id="lace" width="42" height="14" patternUnits="userSpaceOnUse">
      <path d="M0 1h42M0 1c8 0 8 11 16 11S24 1 32 1s8 11 10 11" fill="none" stroke="#c7a86b" stroke-width="1" opacity=".62"/>
      <circle cx="16" cy="8" r="1.8" fill="#8e2438" opacity=".45"/>
    </pattern>
  </defs>
  <path d="M0 7c168 0 242 34 408 34 150 0 244-23 392-23s242 23 392 23c166 0 240-34 408-34v69H0z" fill="url(#veil)"/>
  <path d="M0 7c168 0 242 34 408 34 150 0 244-23 392-23s242 23 392 23c166 0 240-34 408-34" fill="none" stroke="#c7a86b" stroke-width="1.4" opacity=".82"/>
  <path d="M0 60h1600v16H0z" fill="url(#lace)" opacity=".9"/>
</svg>`)

export const SIDEBAR_FRAME = svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 1080" preserveAspectRatio="none">
  <rect x="8" y="8" width="264" height="1064" rx="13" fill="none" stroke="#e6d5a9" stroke-width="1.2" opacity=".82"/>
  <rect x="12" y="12" width="256" height="1056" rx="10" fill="none" stroke="#5b1424" stroke-width="1" opacity=".7"/>
  <g fill="none" stroke="#e6d5a9" stroke-width="1.6" stroke-linecap="round" opacity=".9">
    <path d="M8 66c26-2 32-18 36-42 9 18 22 26 42 28M272 66c-26-2-32-18-36-42-9 18-22 26-42 28"/>
    <path d="M8 1014c26 2 32 18 36 42 9-18 22-26 42-28M272 1014c-26 2-32 18-36 42-9-18-22-26-42-28"/>
  </g>
  <g fill="#fffdfb" stroke="#c7a86b" opacity=".28">
    <path d="M43 23c5 8 5 15 0 22-5-7-5-14 0-22Z"/><path d="M237 23c-5 8-5 15 0 22 5-7 5-14 0-22Z"/>
    <path d="M43 1057c5-8 5-15 0-22-5 7-5 14 0 22Z"/><path d="M237 1057c-5-8-5-15 0-22 5 7 5 14 0 22Z"/>
  </g>
</svg>`)

export const INVITATION_LACE = svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 72" preserveAspectRatio="none">
  <path d="M8 8h344v56H8z" rx="14" fill="none" stroke="#c7a86b" stroke-width="1.3"/>
  <path d="M18 14h324v44H18z" fill="none" stroke="#8e2438" stroke-width=".8" opacity=".34"/>
  <g fill="none" stroke="#c7a86b" stroke-width="1.2" stroke-linecap="round">
    <path d="M9 28c13 0 20-7 22-19 4 11 11 18 23 20M351 28c-13 0-20-7-22-19-4 11-11 18-23 20"/>
    <path d="M9 44c13 0 20 7 22 19 4-11 11-18 23-20M351 44c-13 0-20 7-22 19-4-11-11-18-23-20"/>
  </g>
</svg>`)

export const VOW_SEAL = svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 112 72">
  <defs><filter id="s"><feDropShadow dx="0" dy="3" stdDeviation="2" flood-color="#4e0f1d" flood-opacity=".2"/></filter></defs>
  <g filter="url(#s)">
    <path d="M9 25c17-7 31-5 47 5 16-10 30-12 47-5v34c-18-6-32-3-47 7-15-10-29-13-47-7z" fill="#fffdfb" stroke="#c7a86b" stroke-width="2"/>
    <path d="M56 30v36M17 33c13-3 24-1 33 5M95 33c-13-3-24-1-33 5" fill="none" stroke="#d9c69a" stroke-width="1.3"/>
  </g>
</svg>`)

export const COMPOSER_LACE = svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 36" preserveAspectRatio="none">
  <path d="M0 2h1200" stroke="#c7a86b" stroke-width="1.5"/>
  <path d="M0 5c20 0 20 20 40 20S60 5 80 5s20 20 40 20S140 5 160 5s20 20 40 20S220 5 240 5s20 20 40 20S300 5 320 5s20 20 40 20S380 5 400 5s20 20 40 20S460 5 480 5s20 20 40 20S540 5 560 5s20 20 40 20S620 5 640 5s20 20 40 20S700 5 720 5s20 20 40 20S780 5 800 5s20 20 40 20S860 5 880 5s20 20 40 20S940 5 960 5s20 20 40 20S1020 5 1040 5s20 20 40 20S1100 5 1120 5s20 20 40 20S1180 5 1200 5" fill="none" stroke="#8e2438" stroke-width="1" opacity=".45"/>
  <g fill="#c7a86b" opacity=".72">
    <circle cx="40" cy="18" r="2"/><circle cx="120" cy="18" r="2"/><circle cx="200" cy="18" r="2"/><circle cx="280" cy="18" r="2"/><circle cx="360" cy="18" r="2"/><circle cx="440" cy="18" r="2"/><circle cx="520" cy="18" r="2"/><circle cx="600" cy="18" r="2"/><circle cx="680" cy="18" r="2"/><circle cx="760" cy="18" r="2"/><circle cx="840" cy="18" r="2"/><circle cx="920" cy="18" r="2"/><circle cx="1000" cy="18" r="2"/><circle cx="1080" cy="18" r="2"/><circle cx="1160" cy="18" r="2"/>
  </g>
</svg>`)
