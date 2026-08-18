# Verdandi stage artwork

The five source PNG files in `source/` were supplied by the user for this local skin iteration.
Their original URLs, authors, official/fan-work status, and redistribution permissions have not yet
been verified. They are suitable for local visual testing, but those fields must be completed before
the package is published or redistributed.

`generated/` contains WebP derivatives used by the browser bundle:

- `verdandi-barbecue-seated.webp`: left character, lively / barbecue motif.
- `verdandi-white-knight.webp`: right character, white-vow / guardian motif.
- `verdandi-library-day.webp`: light-theme workspace scene.
- `verdandi-library-night.webp`: dark-theme workspace scene.
- `verdandi-bridal-cg-portrait.webp`: portrait bridal CG integrated into the lower sidebar arch.

Run `pnpm art:generate` after replacing a generated image. The command rebuilds
`src/client/stage-art.generated.ts`, keeping the runtime plugin self-contained.
