# Release checklist

A version exists only when four things agree: the git tag `vX.Y.Z`, the `version`
in `package.json`, the newest section of `CHANGELOG.md`, and the tarball on npm.
Two of them are machine-checked: `.github/workflows/release-guard.yml` fails a tag
push whose tag does not match `package.json`, whose version has no changelog
section, or whose committed `lib/` does not match the sources. The rest is this
checklist.

## 1. Local verification

```powershell
pnpm install --frozen-lockfile
pnpm build
git diff --exit-code -- lib
pnpm test
pnpm typecheck
npm pack --dry-run --json
```

Confirm that the package contains only `lib/index.js`, `lib/client.js`, the DSH manifests, public documentation, license notices, the changelog, and the five storefront previews listed in the `files` allowlist (`light`, `hero-light`, `dark`, `hero-dark`, `settings`). Raw game assets remain in the GitHub source repository for reproducible builds but are not duplicated in the npm tarball, and per-change-point comparison images stay out of both the tarball and `preview/`: the storefront shows the skin as users will see it, not documentation evidence. A release tarball of roughly 8 MB is expected: about 3 MB is the inlined skin artwork in `lib/client.js`, and the rest is the five full-resolution storefront screenshots.

Also check the compatibility line in both READMEs names the host versions this release was actually verified against: it is the first thing a user reads when a new DSH build changes the shell, and it drifts silently otherwise.

## 2. Version and changelog

1. Bump `version` in `package.json` following SemVer: a patch for fixes that keep
   the host contract, a minor for new skin behaviour, a major for a change that
   requires a different host or skin-center generation.
2. Add the matching `## [X.Y.Z] - YYYY-MM-DD` section to `CHANGELOG.md`, written
   from the user's side: what changed on screen, which host version it targets,
   and what the verification was.
3. Commit both together as `chore: release X.Y.Z` and push `main`. Do not tag yet:
   the guard runs on the tag, but reviews and CI run on the branch.

## 3. GitHub release

1. Create `Sddft97/dsh-client-ui-skin-verdandi` as a public repository.
2. Add the GitHub topic `dsh-plugin`.
3. Enable GitHub Issues so users and rights holders have the contact path documented in the public notices.
4. Push the full history and confirm that CI passes. Before submitting to the DSH catalog, the public repository must be at least one day old and contain at least ten commits.
5. Create a tag that matches the `package.json` version exactly (for example `v0.1.3` for `0.1.3`) and a GitHub Release for it, with the body taken from the
   changelog section. Backfill a tag and a Release for every version that reached
   npm, so the history never shows an npm artifact without a matching release; a
   version that was tagged but superseded before publishing is documented in the
   changelog instead of released.
6. Check both README languages, screenshots, and installation commands from a logged-out browser.

## 4. npm release

The scoped package must be published with public access. `publishConfig.access` already enforces this setting, but the explicit flag below makes the release intent auditable. Direct publishing requires npm 2FA or a suitable granular access token.

```powershell
npm login
npm publish --access public
npm view @hjbztlbr/dsh-client-ui-skin-verdandi dist-tags
```

`prepublishOnly` rebuilds, retests, and typechecks before the tarball is created,
so a release cannot ship a stale `lib/`. The `dist-tags` output must show the new
version as `latest`; if the publish reported an error, treat the release as
unfinished and re-check before announcing it.

After publishing, verify that the package page is public and that its `repository` field resolves to the GitHub repository. Test installation in a disposable DSH Web profile before announcing the release.

## 5. DSH plugin market

Submit one YAML entry at `data/plugins/Sddft97__dsh-client-ui-skin-verdandi.yml` in `awesome-dsh-plugin`:

```yaml
url: https://github.com/Sddft97/dsh-client-ui-skin-verdandi
name: Sddft97/dsh-client-ui-skin-verdandi
category: theme
description:
  en: An Aether Gazer Verdandi-inspired skin for the DeepSeek Harness Web UI.
  zh: 一款以《深空之眼》薇儿丹蒂为主题的 DeepSeek Harness Web UI 皮肤。
```

The repository already declares the required `dsh.bundle` manifest, and the storefront screenshots are declared in this repository's own `screenshots.json` under the [new convention](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/main/contributing.md#screenshots--截图optional-recommended--可选推荐), so the shared `data/screenshots.json` must not be touched. The declaration lists one to eight repository-relative image paths and its order is the storefront order; keep those files in `preview/` and update `screenshots.json` whenever a preview is added or renamed. Regenerate the catalog READMEs as required by its contribution guide, and change no unrelated plugin entries.

Publishing to GitHub, npm, or the market is an external state change and should only be performed after explicit approval from the repository owner.
