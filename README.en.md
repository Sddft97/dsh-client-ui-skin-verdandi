# Verdandi · White Vow

> An Aether Gazer Verdandi-themed skin plugin for the DeepSeek Harness Web UI.

**Language / 语言:** [简体中文](README.md) | [English](README.en.md)

[Design specification](docs/design/verdandi-white-vow.md) · [Release checklist](RELEASING.md) · [Asset and rights notice](THIRD_PARTY_NOTICES.md)

![Light mode preview](preview/light.png)

## Features

- Deep crimson `#8E2438` identifies navigation, identity, and selected conversations; bridal white keeps reading and editing areas clean; soft gold is reserved for knight crests and interaction details.
- Styles the sidebar, conversation header, chat history, composer, statistics dock, trace view, details pane, settings dialogs, and terminal hosts.
- Incorporates Verdandi motifs including the vow namecard, bridal portrait, rings, Sacred Tree, Sequence Sword, barbecue, and chibi artwork.
- Uses separate light and dark workspace scenes. The character stage scales smoothly with conversation state and adapts to narrow windows, collapsed sidebars, and reduced-motion preferences.
- Presentation only: the plugin registers no service, does not read or modify model requests, and uploads no data.

![Dark mode preview](preview/dark.png)

## Installation

### Install from npm

```powershell
dsh plugin --profile web add @hjbztlbr/dsh-client-ui-skin-verdandi
```

### Install from GitHub

```powershell
dsh plugin --profile web add github:Sddft97/dsh-client-ui-skin-verdandi
```

After installation, enable “Verdandi · White Vow” in the DSH skin manager and press `Ctrl+F5` to force-refresh the page. Full skins modify many of the same host surfaces, so keep only one enabled at a time.

## Appearance modes

Choose Light, Dark, or Follow System under “Settings → General → Appearance” in DSH. If DSH is set to a fixed appearance, changing only the browser or operating-system theme will not override it.

## Update and uninstall

```powershell
# Update
dsh plugin --profile web update @hjbztlbr/dsh-client-ui-skin-verdandi

# Uninstall
dsh plugin --profile web remove @hjbztlbr/dsh-client-ui-skin-verdandi
```

## Compatibility

- Tested with the DeepSeek Harness `0.1.1-rc.2` Web profile.
- Uses scoped compatibility styles for better-sidebar, AionUI, SSH, Cordis, `.xterm`, and settings portals without replacing terminal ANSI colors or broad system tokens.
- Decorative avatars and character artwork are hidden at smaller viewport sizes so controls and text remain usable.

![Settings compatibility preview](preview/settings.png)

DSH is evolving quickly. If an upgrade causes selector or layout regressions, open an Issue with the DSH version, browser version, affected page, enabled plugin list, and a screenshot.

## Troubleshooting

### The skin is installed but nothing changes

Confirm that the plugin is enabled and other full skins are disabled, then press `Ctrl+F5`. If the problem remains, check the browser console for `__ModuleLoader__` or client-bundle loading errors.

### Buttons or text have poor contrast in Settings

Temporarily disable other plugins that replace global theme tokens. This skin applies compatibility rules only to known DSH host surfaces; include the list of enabled plugins when reporting a reproducible conflict.

### The dark background does not switch

Change the appearance in DSH itself. Browser dark-mode preferences take effect only when DSH is set to Follow System.

## Local development

```powershell
pnpm install
pnpm build
pnpm test
pnpm typecheck
dsh plugin --profile web add link:C:/absolute/path/to/dsh-client-ui-skin-verdandi
```

The package follows the DSH skin-plugin structure: `cordis.patch.yml` registers the bundle row, `skin.json` provides skin metadata, and the client keeps a reversible `apply()` / `dispose()` contract. Runtime styles are scoped under `body[data-dsh-verdandi]`.

## License and assets

Repository code, CSS, build scripts, and original generic ornaments are available under the [MIT License](LICENSE). Character art, scenes, icons, and processed assets from Aether Gazer are excluded from the MIT grant and remain the property of their respective rights holders. This is a free, non-commercial, unofficial fan skin with no affiliation with or endorsement by the game's developers, publishers, operators, or the DeepSeek Harness project.

See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for the full asset boundary. A [Simplified Chinese translation](THIRD_PARTY_NOTICES.zh-CN.md) is also available. Rights holders may request attribution corrections, replacement, or removal through GitHub Issues.
