# Changelog

All notable changes to this skin package are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the versions follow
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

A version exists only when all four agree: the git tag `vX.Y.Z`, the `version` in
`package.json`, the newest section of this file, and the tarball on npm. `.github/workflows/release-guard.yml`
enforces the first two on every tag push; the checklist in `RELEASING.md` covers
the rest.

## [Unreleased]

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
