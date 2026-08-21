# Verdandi stage artwork

The source PNG files in `source/` were supplied by the user for this local skin iteration.
Their original URLs, authors, official/fan-work status, and redistribution permissions have not yet
been verified. They are suitable for local visual testing, but those fields must be completed before
the package is published or redistributed.

`generated/` contains WebP derivatives used by the browser bundle:

- `verdandi-barbecue-seated.webp`: left character, lively / barbecue motif.
- `verdandi-white-knight.webp`: right character, white-vow / guardian motif.
- `verdandi-library-day.webp`: light-theme workspace scene.
- `verdandi-library-night.webp`: dark-theme workspace scene.
- `verdandi-bridal-cg-portrait.webp`: portrait bridal CG integrated into the lower sidebar arch.
- `verdandi-vow-avatar-frame.webp` + `verdandi-wedding-avatar.webp`: formal vow crest in the conversation header.
- `verdandi-vow-rings.webp`: official ring art layered over the composer vow book.
- `verdandi-ring-tag.webp` + `verdandi-vow-namecard.webp`: selected-conversation identity treatment.
- `verdandi-sacred-tree-white.webp`: white-alpha Sacred Tree emblem used as a tinted watermark.
- `verdandi-chibi-left.webp` + `verdandi-chibi-right.webp`: hero-only composer corner mascots.
- `verdandi-childhood-record.webp`: childhood record used only in the empty vow-archive details state.
- `verdandi-sequence-sword.webp`: Sequence Sword motif reserved for the send action and trace-view details relic.
- `verdandi-q-avatar.webp`: compact Q-style portrait shown only when the sidebar is collapsed to rail mode.

Run `pnpm art:generate` after replacing a generated image. The command rebuilds
`src/client/stage-art.generated.ts`, keeping the runtime plugin self-contained.
