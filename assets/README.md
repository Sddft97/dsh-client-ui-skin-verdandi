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
- `verdandi-bridal-floral-corner.webp`: original transparent white-lily, burgundy-rose, veil, and ribbon corner ornament generated for this skin; mirrored at header and composer edges.
- `verdandi-bridal-veil-corner.webp`: original layered white-tulle, lace, pearl, and burgundy-ribbon corner generated for this skin; used at the sidebar frame, header, and inside the composer.
- `verdandi-vow-folder.webp`: original ivory invitation-folder icon with burgundy ribbon and ring clasp generated for this skin; replaces the host folder glyph without changing its hitbox.
- `verdandi-childhood-record.webp`: childhood record used only in the empty vow-archive details state.
- `verdandi-sequence-sword.webp`: Sequence Sword motif reserved for the send action and trace-view details relic.
- `verdandi-q-avatar.webp`: compact Q-style portrait shown only when the sidebar is collapsed to rail mode.

Run `pnpm art:generate` after replacing a generated image. The command rebuilds
`src/client/stage-art.generated.ts`, keeping the runtime plugin self-contained.

The two generated bridal assets above were created for this repository from text prompts and do not contain third-party character artwork. Their source PNGs are retained beside the user-supplied source assets so future crops and WebP settings remain reproducible.
