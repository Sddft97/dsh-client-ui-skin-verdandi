# Release checklist

## 1. Local verification

```powershell
pnpm install --frozen-lockfile
pnpm build
pnpm test
pnpm typecheck
npm pack --dry-run --json
```

Confirm that the package contains only `lib/index.js`, `lib/client.js`, the DSH manifests, public documentation, license notices, and preview images. Raw game assets remain in the GitHub source repository for reproducible builds but are not duplicated in the npm tarball.

## 2. GitHub release

1. Create `Sddft97/dsh-client-ui-skin-verdandi` as a public repository.
2. Add the GitHub topic `dsh-plugin`.
3. Enable GitHub Issues so users and rights holders have the contact path documented in the public notices.
4. Push the full history and confirm that CI passes. Before submitting to the DSH catalog, the public repository must be at least one day old and contain at least ten commits.
5. Create a `v0.1.0` tag and GitHub Release using the same version as `package.json`.
6. Check both README languages, screenshots, and installation commands from a logged-out browser.

## 3. npm release

The scoped package must be published with public access. `publishConfig.access` already enforces this setting, but the explicit flag below makes the release intent auditable. Direct publishing requires npm 2FA or a suitable granular access token.

```powershell
npm login
npm publish --access public
```

After publishing, verify that the package page is public and that its `repository` field resolves to the GitHub repository. Test installation in a disposable DSH Web profile before announcing the release.

## 4. DSH plugin market

Submit one YAML entry at `data/plugins/Sddft97__dsh-client-ui-skin-verdandi.yml` in `awesome-dsh-plugin`:

```yaml
url: https://github.com/Sddft97/dsh-client-ui-skin-verdandi
name: Sddft97/dsh-client-ui-skin-verdandi
category: theme
description:
  en: An Aether Gazer Verdandi-inspired skin for the DeepSeek Harness Web UI.
  zh: 一款以《深空之眼》薇儿丹蒂为主题的 DeepSeek Harness Web UI 皮肤。
```

The repository already declares the required `dsh.bundle` manifest. Add one to eight GitHub-hosted image URLs under the same repository URL in `data/screenshots.json`; use the three files under `preview/` and keep their order intentional. Regenerate the catalog READMEs as required by its contribution guide, and change no unrelated plugin entries.

Publishing to GitHub, npm, or the market is an external state change and should only be performed after explicit approval from the repository owner.
