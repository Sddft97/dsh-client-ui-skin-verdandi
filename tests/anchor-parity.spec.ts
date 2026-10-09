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
 * it; the plugin form keeps to the per-skin hooks instead.
 */
const V2_ONLY = ['data-dsh-surface']
const V1_ONLY: string[] = []

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
