# Changelog

All notable changes to this skin package are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the versions follow
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

A version exists only when all four agree: the git tag `vX.Y.Z`, the `version` in
`package.json`, the newest section of this file, and the tarball on npm. `.github/workflows/release-guard.yml`
enforces the first two on every tag push; the checklist in `RELEASING.md` covers
the rest.

## [Unreleased]

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
