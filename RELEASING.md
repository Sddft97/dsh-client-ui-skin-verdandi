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

1. Create `hjbztlbr/dsh-client-ui-skin-verdandi` as a public repository.
2. Add the GitHub topic `dsh-plugin`.
3. Push the verified commit and confirm that CI passes.
4. Create a `v0.1.0` tag and GitHub Release using the same version as `package.json`.
5. Check the README screenshots and installation commands from a logged-out browser.

## 3. npm release

The scoped package must be published with public access. `publishConfig.access` already enforces this setting.

```powershell
npm login
npm publish
```

After publishing, test installation in a disposable DSH Web profile before announcing the release.

## 4. DSH plugin market

Submit the GitHub repository to the DSH plugin market as category `theme` and repository type `dsh.bundle`. Include one to eight GitHub-hosted screenshots, the package name, a short Chinese description, and the rights disclaimer. Confirm the market's current contribution rules before opening the pull request.

Publishing to GitHub, npm, or the market is an external state change and should only be performed after explicit approval from the repository owner.
