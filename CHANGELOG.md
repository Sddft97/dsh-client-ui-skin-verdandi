# Changelog

All notable changes to this skin package are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the versions follow
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

A version exists only when all four agree: the git tag `vX.Y.Z`, the `version` in
`package.json`, the newest section of this file, and the tarball on npm. `0.1.6` was
bumped and written up but never tagged or published, so its content shipped in `0.1.7`
and its section below is kept as the record of that. `.github/workflows/release-guard.yml`
enforces the first two on every tag push; the checklist in `RELEASING.md` covers
the rest.

## [0.1.7] - 2026-10-10

### Fixed

- The window-drag handle is only mounted where the shell actually uses a drag region.
  The shell's own drag-region rules are platform-gated (`[data-platform="darwin"]`), so
  on a platform whose window has a native title bar `-webkit-app-region` is unused;
  adding a `drag` band there would invent an area the host never reserved, which is the
  same class of bug this round fixed. The hook checks the header's computed region and
  skips (or removes) the strip where the shell has none -- on top of the `no-drag`
  opt-out, which is a no-op on such platforms anyway.
- The character art no longer covers plugin surfaces. The stage is
  `position: absolute; z-index: 0`, which beats a static page in paint order, so on the
  MCP connector and similar plugin pages the figures sat on top of the cards. Whenever
  the main slot hands out a page surface instead of the conversation seat -- the
  conversation is the only occupant that carries `data-slot` -- the stage drops to
  `z-index: -1` -- above the pane's own background (it is a stacking context), below
  the page's content -- so a page with its own background hides it outright and a page
  without one shows it behind the content instead of over it.
- The top bar is clickable again on the desktop app. Its top bar is an Electron
  window-drag region (`-webkit-app-region: drag` on the header and its rows, `no-drag`
  on each control) and that property is inherited, so every decoration the skin mounted
  into the header inherited `drag` and re-declared the whole band -- over the controls
  included -- as draggable. A real mouse press on the overflow menu or the panel toggle
  started a window drag instead of reaching the button. Only the desktop app was
  affected, and nothing in-page can see it: `elementFromPoint` skips
  `pointer-events: none` layers, and injected clicks never enter the native drag path.
  The skin's own layers opt out now. Because the shell computes a region as "each drag
  element's rect minus its own no-drag descendants", four full-band opt-outs also carved
  the window drag out of the top bar, so the skin hands one handle back: a single
  `header-drag-strip` decoration that is `drag` again and covers only the empty middle
  of the bar (left 40%, width 20%), measured to overlap zero controls. Tests pin the
  invariant that this is the sheet's only `-webkit-app-region: drag` declaration.
- A split header control is one pill again. The shell's "open with <app>" control is
  two buttons in one box (`div > button + button`); the blanket rule that gives every
  header button a capsule gave each half its own, so the seam showed a notch and two
  inset rings butting together. The pair's box is the pill now and the halves stay
  square, borderless and transparent inside it -- structural selection (a container
  holding two adjacent buttons), minus the tab list, which is `button + button` too.
- The header's own dropdown is clickable again. dsh 0.2.0 moved the title row one slot
  deeper (`conversation.session.header`, a `display: contents` seat), which made the
  skin's `z-index: 3` rule for the header rows score 0-3-0 and pushed the 0-2-0
  title-row lift below it -- so the tab row (later in DOM order) painted over the top
  of the `更多操作` menu and swallowed the clicks meant for its first item. The lift is
  spelled out at 0-3-0 or above and matched structurally
  (`> :has([aria-haspopup])`) as well as by class, so it no longer depends on the
  host's nesting depth or on source order.
- Decorative layers no longer outrank host popovers. The composer seal (an absolutely
  positioned ornament that floats above the composer card) covered the model picker,
  because the skin had lifted the composer seat to `z-index: 15` and the header to
  `z-index: 20`: a popover the host renders inside a lower context cannot win against
  a two-digit lift. Skin-carried layers stay in the single digits now (header 4,
  composer seat 3, seal 1) and the seal sits below the composer's own content.
  Pinned by a test: no skin lift reaches double digits, and the seal stays under the
  seat.

## [0.1.6] - 2026-10-09（未发布：没有 tag，也没有 npm 产物；内容并入 0.1.7）

### Fixed

- The running status is the skin's own line now. dsh 0.2.0 mounts it as a node of
  its own (`[data-chat-running]`, with a whale tail and a `TextShimmer` sweep); the
  skin used to collapse the host's label, restate the copy (`薇儿烧烤中...` /
  `Verdandi is grilling...`) from a pseudo-element and draw its own gold hairline
  under the row, anchored on a marker the 0.2.0 shell never grows — so the whole
  thing was dead there and the stock blue status showed through. The takeover is
  rebuilt on the host's own marker, and it owns the whole line: the icon, the copy
  and the sweep. The host's tail is kept verbatim, so `，用时 20 秒 ···` keeps
  ticking through the replacement while only the leading phrase is swapped for the
  skin's; the icon is the skin's own sword mark in the host's 14px slot with a
  breathing swing; the copy is a single gradient layer whose ends are the ink
  colour and which tiles, so the band cannot ghost and the glyphs always have a
  background to be painted from — a non-repeating gradient leaves the tail of the
  line unpainted once it slides off the element, and `color: transparent` then
  renders nothing at all. The host's live region is replaced by one of ours
  carrying the host's own phrase, so assistive tech keeps hearing the shell's own
  localization while the paint is ours. Everything keys on `data-chat-running` and
  on the phrase text — no host class name is involved, and the label is found by
  its text. Fail closed: an install whose hooks are refused, or a phrase no locale
  we know, leaves the host's line completely alone; for that middle state the two
  deep-diving tokens are still re-mapped, so even then the shell's line is painted
  in the skin's ink (5.18:1 light / 2.03:1 dark over the measured artwork band) and
  its sweep in the skin's crimson (1.48:1 / 1.95:1, and the step from the ink is
  3.5x / 4.0x against the host's own 1.68x / 1.42x). The `data-verdandi-running`
  marker and the hook that projected it are retired with it.
- The registered sidebar rows read as one list again. The rows the hooks mark
  (`task-board` / `skill-explorer` / `ssh`) carried a 24px gold ring, a taller
  row box and a wider gap, while the official Plugins / Schedule rows and the
  unmarked plugin rows beside them stayed bare — so the column alternated
  between ringed and bare icons at two different indents. The ring block is
  gone and the marked rows keep the host's own geometry (16px glyph, 8px gap,
  36px row), which is what makes every row align rather than an override that
  lines up three of them. Measured on the live 0.2.0-rc.2 shell: all six rows
  now compute to `height: 36px`, a 16px glyph with no border, and the label at
  `x = 46`.
- The trace panel's «load earlier history» tab sits on the lane edge. The host
  draws that control square and flush with a left-anchored fade, but the skin's
  blanket `button { border-radius: 999px }` inside the panel turned it into a
  pill — and at 28×50 the arc ate half of the top and bottom edges, so the
  trailing rounding pulled the fill off the panel border and left a hairline gap
  along both. It now keeps square left corners, takes the same 6px trailing
  radius as the other row chips, and drops its top and bottom rules so the fill
  meets the panel's border lines instead of doubling them one pixel inside.
- The macOS new-session button no longer takes the host's `#ffffff8c` fill over
  the invitation card, and the brand wordmark reads in the skin's gold — the
  brand is a bare `<span>` on macOS, so the `button[aria-label]` rules never
  reached it. Both live behind `[data-platform='darwin']`, so Windows and the
  web host are untouched.
- The send button keeps its crimson-and-sword treatment through every state. The
  host cycles the label 发送消息/Send message → 停止生成/Stop generating →
  排队发送/Queue message → 插话发送/Steer message and only the first two were
  matched, so the button fell back to the stock look the moment a turn started.
- The trace panel matches both locale spellings of its aria-label
  (`轨迹时间线` and `Trajectory timeline`). The Chinese one was missed, so under a
  Chinese UI the panel lost its paper surface and gold hairline entirely.

### Removed

- Selectors nothing in the shipped host matches: `_turnStatus` /
  `_turnStatusClock` (the class was dropped in 0.1.7 and the live status now
  rides `[data-turn-process]` plus the running marker the hooks project, so the
  whole block — including its `animation: none` shimmer kill and the
  forced-colors pair — was dead), `_producedLabel` / `_producedMore`,
  `[class*='codeBlock']` on the code-block rule, the `svg > rect` /
  `svg > g:last-of-type` new-session icon rules, and the `展开侧边栏` /
  `Expand sidebar` aria labels the shell never emits. Each removal is pinned by
  a test that fails if the selector comes back, so the cleanup cannot be undone
  by accident.

### Verified

- Live on the running DSH `0.2.0-rc.2` web host and the `0.2.0-rc.2` macOS
  desktop client, with the skin installed through skin-center `0.4.5` as the
  asset form: the sidebar rows and the trace tab were measured before and after
  (computed styles and pixel scans, not eyeballing), and the same two changes
  were reproduced on the plugin form in this repository.
- Gates: 44/44 tests (the CSS guardrails, the apply/bundle specs, and the
  two-form anchor parity check), `tsc --noEmit` clean, `pnpm build` reproducible
  (a second build produces identical bytes), and `npm pack --dry-run` still
  ships only `lib/` plus the manifests, docs and the five storefront previews.
- The running status was measured against a fixture of the host's own node — its
  real class names, its real stylesheet — and then against the live page with the
  skin's own hooks in charge: the host's visual children all compute to
  `display: none`, the takeover marker survives the passes our own writes trigger,
  the copy reads `薇儿烧烤中，用时 20 秒 ···`, the live region carries the shell's
  `深度求索中`, the icon's mask resolves to the skin's own asset and its transform
  moves frame to frame, and a real `characterData` tick (what the host's 1 Hz timer
  does) carries the copy to `薇儿烧烤中，用时 1 分 07 秒 ···`. Two spec cases pin the
  takeover and its fail-closed path, and both were mutation-tested: reverting the
  marker re-assertion and reverting the "never mistake our own live region for the
  host's label" guard each turn the suite red. The copy-swap removal and the
  takeover are on both forms; the takeover is a 0.2.0-only capability, so on 0.1.7
  and earlier the status keeps the host's stock look.

## [0.1.5] - 2026-09-26

### Fixed

- The chapter title reads as a title, without a separator. The turn-process
  label ("用时 …") now sets in the brand colour — crimson in light, gold in
  dark, through the official token — on its opaque warm paper, and the crimson
  chapter bar widens to 4px; the fold labels stay in meta ink, so the
  hierarchy is literally "the heading takes the brand colour, the entries do
  not". The soft fading gold rule under the row is removed: at any opacity it
  stayed invisible over the light artwork, and an invisible ornament is not a
  hierarchy.
- The fold chevron is a paper disc inside a gold ring, and the arrow is
  ink-dark in both themes. Colouring the arrow per-theme put near-white ink on
  the gold badge in dark mode (~1.9:1) — the arrow vanished exactly where the
  user looked for it — and the old hover rule repainted it gold-on-gold. The
  badge's hover feedback is now the ring brightening from 55% translucent
  1.5px to full-strength 2px: no colour inversion anywhere, so nothing can
  blend into anything. Rotation stays with the host's own data-open rule; the
  badge scales through the individual `scale` property, which composes with
  it.
- The clock pill no longer hugs its round edge: a constant, hover-independent
  `padding-left: 10px` moves the timestamp off the pill's rounded end (the
  host's own padding is 0). The geometry-guard tests now allow exactly this
  one constant declaration and keep banning everything else.

### Fixed

- The copy tooltip no longer exists. The host's action tooltip (复制) is a flex
  child of the clock rows whose width animates open, so the pill grew by ~66px
  while the pointer rested on the button and snapped back on leave — with the
  row's own `transition: all` that animated the buttons under the pointer. A
  first fix lifted the bubble out of the flow, but a floating card over live
  conversation is its own problem (it covers messages and its text hugged the
  border), so the bubble is simply not rendered inside these rows: the copy
  icon with its gold hover tint is self-explanatory, and the jitter mechanism
  dies with the bubble. A real pointer-path trace confirms the pill's geometry
  never changes.
- The finished process rows are legible over the artwork again. Measured on the
  live dsh 0.1.7-rc.2 app, the bare process ink (`--vd-ink-meta`, light rose-brown)
  sat on artwork bands as dark as luminance 0.007, so "已协调子智能体" and its
  siblings rendered at 1.37:1–2.4:1 in light mode — below every threshold the
  skin's own readability guard promises. Two paint-only corrections:
  - The turn-process label's paper wash no longer fades to transparent at its
    tail — the last characters of "用时 21分28秒" were landing on bare artwork.
    The gradient now holds 72% of the slip at 100% (worst case ≈5.5:1 under the
    glyphs, ≈7:1 where the wash is full), while still easing towards the row's
    end so it reads as a soft ground rather than a filled bar.
  - The work-steps fold labels (`[data-process-activity]`, dsh 0.1.7) had no
    wash at all; they now carry the turn label's paper wash and radius. The
    label is the disclosure button's last child, so the inline padding shifts no
    sibling, and the row box the host drew stays where it is.
- The chapter hierarchy inside a turn is readable at a glance. The stock host
  titles the turn-process row ("用时 …", which may fold many step groups) with
  a full-width separator; the skin keeps that title grammar without the hard
  line: the label sets in full ink on opaque warm paper marked by a crimson
  chapter bar and capped by a solid gold ring, and a soft gold rule fades in
  and out across the column under it (one per turn; the running state keeps
  its own brighter rule with the sweep riding it). The fold labels keep the
  lighter translucent wash. The fold-state chevron — a 14px 1px-stroke svg in
  the host's caption grey, previously invisible on the paper pill — reads as
  an ink arrow on a solid gold badge; its rotation is the host's own
  data-open rule, which an earlier `transform: scale(1.12)` on the badge had
  silently overridden (the arrow stopped turning) — the badge now scales via
  the individual `scale` property, which composes with the host's transform.
  The 14px box is untouched, so nothing around it moves.
- The ladder of gold hairlines under an expanded fold is gone. The old chapter
  rule drew a 1px gold border under every `[data-step-process][data-chat-paging-anchor]`
  row, but every step row carries that anchor — the rows inside an expanded
  body and the virtualizer's compressed stubs included — so a fold rendered a
  stack of hairlines, loudest in dark mode. The hairline was removed; the fold
  labels' wash pills carry the chapter language instead.
- The expanded work-step body no longer glues its rows together: the host
  stacked the call rows directly under the disclosure and against the next
  fold, so the crimson command rows read as attached to the title. The body
  gets a 4px top margin and a 7px rhythm between its rows — they are static
  content the user explicitly opened, not hover-revealed chrome, so the
  geometry is safe to set.
- The session navigation rail (the host's turn mini-map at the pane's right
  edge) is findable again. It drew every turn as a 20×2 tick in
  `--dsw-alias-border-l4`, which dissolved over the artwork; the rail now gets
  a paper seat fading in from the pane edge, loaded turns read in the skin's
  ink, unloaded ones stay fainter, and the current turn takes the brand colour
  (crimson in light, gold in dark). Anchored through
  `[data-slot='conversation.view'] nav:has([class*='_marks'])`, so no CSS-module
  hash is load-bearing.
- The asset form (dsh-skins `skins/verdandi`) re-declared the old fading
  gradient in its later status-swap rule, which would have silently overridden
  the chapter rule; the duplicate declaration is removed so both forms resolve
  through the same single rule.

### Verified

- Live, on the running app with the asset form served from the skin center:
  computed styles carry the new wash (tail alpha 0.649), the floating tooltip
  measures 58×42 centred on the button axis over the row, and screenshots in
  both themes show the finished process rows on their paper pills, the
  badged chevron, and the rail. Dark mode was already healthy (12.3:1 bare,
  15.5:1 triggers, 10.5:1 clock pill) and is unchanged apart from sharing the
  same wash tokens. Gates: 43/43 tests, `tsc --noEmit` clean, anchor parity
  holds, skin-center catalog PASS, live fingerprint PASS.

## [0.1.4] - 2026-09-25

### Fixed

- One avatar per assistant node. dsh 0.1.7 renders the reasoning block and the
  folded work-steps body inside the transcript, and both contain markdown of their
  own, so the avatar decoration was attached to those too and expanding either
  block grew a second and third avatar.
- The tail clock and copy/branch row no longer jitter on hover. The host fades that
  row in through `[data-actions-reveal=hover]:hover`, and the skin had been
  resizing it (width, height, margin, padding, border), so the buttons slid under
  the pointer while the fade ran and the two hover states fought each other. The
  row is now painted and never resized; the harness proves the geometry is
  identical before and after a forced hover.
- The rows the host draws without a surface are readable again. The session header
  was never marked at all — the hook looked for
  `[data-slot='conversation.session.header'] > header`, which 0.1.7 no longer
  renders — so the header surface, its agent-team and mode chips and its 对话/轨迹
  tabs stayed unstyled; the trigger rows (收到执行请求, 继续执行目标) lost their
  surface on hover because the skin's translucent tint replaced the host's opaque
  fill; and the user message's clock row lives beside the bubble instead of inside
  the turn tail, so it never received the slip. All three are covered now, and every
  hover-revealed row stays paint-only. The context notice row is marked for the slip
  through its own `[data-context-source]` / `[data-context-summary]` attributes.

### Changed

- Light mode no longer washes the conversation. The stage veil was white at 30%,
  which pushed the whole column towards paper white and read as an overlay over the
  artwork; it is now a warm neutral at 18% that darkens instead of washing. The
  caption seat also joins the ink family, so the clock, the copy icons and the tool
  captions stop resolving to a cool grey over this skin's ivory surfaces.
- The running status is an in-flow status line instead of a floating white bar: no
  fill, no radius, the label as the chapter's own caption, and the gold hairline
  under the row carrying the sweep. The copy keeps a paper wash that fades out,
  because bare ink over the artwork's darkest band measures 1.14:1.
- The folded work-steps group (dsh 0.1.7 `[data-step-process]`, which the skin had
  no rule for at all) now carries the same chapter language as the turn row, with
  its label addressed through the host's own `[data-process-activity]` anchor.

### Notes

- The two forms are back in anchor parity. The asset port had anchored the turn
  tail on `data-dsh-part="turn-tail"`, an attribute the shell never emits, so its
  tail rules were dead in the real app while the plugin form worked. It now uses
  `data-turn-tail`, and `tests/anchor-parity.spec.ts` fails when the forms drift
  apart again, including on a fresh checkout where the port is not present.
- Backward compatible with the pre-0.1.7 shell: the new rules are inert there, and
  the 0.1.5 mirror renders 0 differing pixels against 0.1.3 in both forms.

## [0.1.3] - 2026-09-25

### Fixed

- Keep the "new session" chip readable on the dsh 0.1.7 shell. The sidebar button
  now wraps its label in `newSessionLabel` / `newSessionContent` and appends a
  shortcut hint, so the exact-text hook stopped matching and the chip fell back to
  the host default — near-white on the skin's ivory sidebar in light mode. The
  chip is now tagged by the stable `newSession` class suffix, with the text rule
  kept as the fallback for older shells.
- Keep the running status on the dsh 0.1.7 shell. The host removed the
  `_turnStatus` class when it moved the live status into the turn-process ribbon,
  which silently retired the skin's copy swap; the host wording came back. The
  swap is now anchored on `[data-turn-process] [class*="_label"]` and scoped to
  the running state by a `data-verdandi-running` marker, so the running line shows
  the skin's own wording while the finished states keep the host's.

### Notes

- Backward compatible with the pre-0.1.7 shell. The change set is additive: no
  legacy selector or text rule was removed, and the new logic stays inert where
  the new structures are absent. Verified against a DOM reconstructed from the
  0.1.5 runtime in both skin forms, light and dark: 0 differing pixels versus
  0.1.2, while the 0.1.7 structures pick up the fix.

## [0.1.2] - 2026-09-22

### Fixed

- Contain wide tables inside the message card instead of letting the host's
  full-bleed wrapper push them past the card edge, where the official
  `overflow-x: hidden` cut them off.

### Changed

- Rewrote §15 of the design document for a public audience.
- Ignore the `.external/` working directory and scope the test runner to
  `tests/`, so a local clone of a related repository cannot join the test run.

## [0.1.1] - 2026-09-20

Tagged in git, never published to npm: the registry went from 0.1.0 straight to
0.1.2, and the 0.1.2 tarball contains this section's content as well.

### Fixed

- Keep the running-status shimmer visible and legible over the artwork, then drop
  the status scrim and let the theme name its own running state.
- Stop the archive-bar tokens at the tool-card header, and ink the produced label.
- Target the hero chip controls instead of the row's children.
- Carry the new-session workspace chips on the slip family.
- Keep transcript metadata legible over the scenic workspace.
- Unclip the header dropdowns and drop the chip stud.

### Changed

- Bound the npm tarball to the storefront previews declared in `screenshots.json`.

### Documentation

- Declared the storefront screenshots in-repo.
- Recorded the legibility guard with before/after evidence, the hero chip family,
  the `display:contents` slot wrapper, the running-status shimmer decision, and
  the tool-body token leak.

## [0.1.0] - 2026-08-22

### Added

- First public release: deep-crimson navigation, bridal-white reading and editing
  surfaces, soft-gold knight details, stateful artwork, light and dark schemata,
  and bilingual public documentation.
