/**
 * Anchor parity between the two skin forms.
 *
 * The v2 asset skin (skins/verdandi in the dsh-skins repository) is a port of this
 * plugin's stylesheet, and the port has drifted before: the v2 copy anchored the
 * turn tail on `data-dsh-part="turn-tail"`, an attribute the shell never emits, so
 * its tail rules were dead in the real app while the v1 form worked — invisible to
 * the A/B renders because the harness carried neither attribute at the time.
 *
 * These checks make that class of drift fail loudly:
 *  1. neither form may anchor on an attribute the shell does not emit;
 *  2. when the dsh-skins clone is present, both forms must use the same set of
 *     `data-*` anchors, apart from the documented allowances below.
 *
 * The clone lives in the git-ignored `.external/` directory, so check 2 skips on a
 * fresh checkout (CI); check 1 always runs.
 */
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

// vitest runs from the package root, and `import.meta.url` is not a file URL once
// the runner has transformed the module, so the root comes from the process.
const repoRoot = process.cwd()
const v1CssPath = join(repoRoot, 'src', 'client', 'verdandi.module.css')
const v2SkinDir = join(repoRoot, '.external', 'dsh-skins', 'skins', 'verdandi')

/** Attributes the shell, the semantic adapter or this skin do not emit. */
const DEAD_ANCHORS = ['data-dsh-part']

/**
 * Anchors that may legitimately appear in one form only. `data-dsh-surface` is
 * stamped by the dsh-web-all semantic adapter and only the asset form anchors on
 * it; the plugin form keeps to the per-skin hooks instead. `data-dsh-verdandi` is
 * this plugin's own body scope: the asset form is scoped by the skin center's
 * injected `data-dsh-skin`, so the marker never appears in its stylesheets.
 * `data-verdandi-pane` is the plugin's region-adapter stamp; the asset form
 * receives its region hooks from the host's semantic adapter instead.
 *
 * The `pending-port` group is a tracked debt, not a permanent exemption: these
 * anchors are the plugin form's DSH 0.2-shell adaptations (the running-line
 * takeover on the shell's `[data-chat-running]` node, the platform-gated drag
 * handle, the plugin pages) that the asset form has not ported yet — the local
 * dsh-skins clone predates that work and upstream has no port either (verified
 * 2026-10-26). When the asset form is ported to 0.2, its copy gains these
 * anchors and every entry here must be pruned.
 */
const V2_ONLY = [
  'data-dsh-surface',
  // pending-port: anchors the stale v2 copy still carries from its pre-0.2 port;
  // the plugin form replaced both in the 0.2 adaptation (the running line moved
  // to the `[data-chat-running]` takeover, the nav rail to the region adapter's
  // hooks), and the asset-form port retires them the same way.
  'data-verdandi-nav-entry',
  'data-verdandi-running',
]
const V1_ONLY = [
  'data-dsh-verdandi',
  'data-verdandi-pane',
  // pending-port: asset form has not received the 0.2-shell adaptation
  'data-chat-running',
  'data-platform',
  'data-plugin-detail',
  'data-plugin-panel',
  'data-verdandi-running-a11y',
  'data-verdandi-running-bar',
  'data-verdandi-running-copy',
  'data-verdandi-running-icon',
  'data-verdandi-running-line',
]

const anchors = (css: string): string[] =>
  [...new Set([...css.matchAll(/\[(data-[a-z0-9-]+)/g)].map((m) => m[1]))].sort()

const readIfPresent = (path: string): string | null =>
  existsSync(path) ? readFileSync(path, 'utf8') : null

const v1Css = readFileSync(v1CssPath, 'utf8')

describe('skin anchor parity', () => {
  it('the plugin form never anchors on an attribute the shell does not emit', () => {
    const used = anchors(v1Css).filter((a) => DEAD_ANCHORS.includes(a))
    expect(used, `dead anchors in verdandi.module.css: ${used.join(', ')}`).toEqual([])
  })

  it('keeps both forms on the same anchors', () => {
    const skinCss = readIfPresent(`${v2SkinDir}/skin.css`)
    const patchesCss = readIfPresent(`${v2SkinDir}/patches.css`)
    if (skinCss === null || patchesCss === null) {
      // Fresh checkout without the dsh-skins clone: check 1 still guards this form.
      expect(v1Css.length).toBeGreaterThan(0)
      return
    }

    const v2Used = [...new Set([...anchors(skinCss), ...anchors(patchesCss)])].sort()
    const v1Used = anchors(v1Css)

    const dead = v2Used.filter((a) => DEAD_ANCHORS.includes(a))
    expect(dead, `dead anchors in the asset form: ${dead.join(', ')}`).toEqual([])

    const v1Only = v1Used.filter((a) => !v2Used.includes(a) && !V1_ONLY.includes(a))
    const v2Only = v2Used.filter((a) => !v1Used.includes(a) && !V2_ONLY.includes(a))

    expect(v1Only, `anchors only the plugin form uses: ${v1Only.join(', ')}`).toEqual([])
    expect(v2Only, `anchors only the asset form uses: ${v2Only.join(', ')}`).toEqual([])
  })
})
