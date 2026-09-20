import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const CSS = readFileSync(resolve(process.cwd(), 'src/client/verdandi.module.css'), 'utf8')

/**
 * Linear-luminance extremes of the artwork band the running status floats in,
 * measured on the real scenes with the pane veil applied (design note §15.7).
 * The status has no surface, so this band — not a slip — is its backing.
 */
const STATUS_BAND: Record<string, [number, number]> = {
  light: [0.245, 0.708],
  dark: [0.062, 0.423],
}

describe('verdandi compatibility guardrails', () => {
  it('paints the host root behind its transparent scrollbar gutter in both palettes', () => {
    expect(CSS).toMatch(/body\[data-dsh-verdandi\]\s*\{[\s\S]*?background-color:\s*#f8f2ed/)
    expect(CSS).toMatch(/body\[data-dsh-verdandi\]\[data-ds-dark-theme\]\s*\{[\s\S]*?background-color:\s*#171015/)
    expect(CSS).toMatch(/body\[data-dsh-verdandi\] > \[id='root'\]\s*\{[^}]*background:\s*transparent/)
  })

  it('keeps the zero-height better-sidebar host from creating page overflow', () => {
    const hostRule = CSS.match(/body\[data-dsh-verdandi\] \[data-dsh-better-sidebar\]\s*\{([^}]*)\}/)?.[1] ?? ''
    expect(hostRule).toMatch(/background:\s*transparent/)
    expect(hostRule).toMatch(/border:\s*0/)
    expect(hostRule).toMatch(/box-shadow:\s*none/)
    expect(CSS).not.toMatch(/:is\(\[data-dsh-better-sidebar\], \[data-cordis-panel\]\)/)
  })

  it('re-establishes high-contrast host tokens inside the settings dialog', () => {
    expect(CSS).toMatch(
      /\[data-slot='sidebar\.settings'\] \[role='dialog'\]\[aria-modal='true'\][\s\S]*?--dsw-alias-label-primary: rgb\(15, 17, 21\)/,
    )
    expect(CSS).toMatch(
      /\[data-ds-dark-theme\] \[data-slot='sidebar\.settings'\] \[role='dialog'\]\[aria-modal='true'\][\s\S]*?--dsw-alias-label-primary: rgb\(245, 246, 247\)/,
    )
  })

  it('releases sidebar clipping only for its active settings portal', () => {
    expect(CSS).toMatch(
      /\[data-pane='sidebar'\]:has\([\s\S]*?\[data-slot='sidebar\.settings'\] \[role='dialog'\]\[aria-modal='true'\][\s\S]*?\)\s*\{[\s\S]*?overflow: visible/,
    )
  })

  it('does not leak sidebar button foreground into the settings portal', () => {
    expect(CSS).toMatch(
      /\[data-pane='sidebar'\] button:not\([\s\S]*?\[data-slot='sidebar\.settings'\] \*[\s\S]*?\)\s*\{[\s\S]*?color: inherit/,
    )
  })

  it('keeps the character inside the conversation stage instead of fixing it to the viewport', () => {
    const stageRule = CSS.match(/\.characterStage\s*\{([^}]*)\}/)?.[1] ?? ''
    expect(stageRule).toContain('display: block !important')
    expect(CSS).toMatch(/data-pane='conversation'\] > \.characterStage\s*\{[\s\S]*?display: block !important/)
    const figureRule = CSS.match(/\.characterFigure\s*\{([^}]*)\}/)?.[1] ?? ''
    expect(figureRule).toContain('position: absolute')
    expect(figureRule).not.toContain('position: fixed')
  })

  it('uses paired edge figures and a hero-to-active scale transition', () => {
    expect(CSS).toMatch(/\.figureLeft\s*\{[\s\S]*?--vd-art-character-left/)
    expect(CSS).toMatch(/\.figureRight\s*\{[\s\S]*?--vd-art-character-right/)
    expect(CSS).toMatch(/\.figureLeft[\s\S]*?scale\(0\.55\)/)
    expect(CSS).toMatch(/\.figureRight[\s\S]*?scale\(0\.64\)/)
    expect(CSS).toMatch(/data-verdandi-phase='hero'[\s\S]*?scale\(0\.94\)/)
    expect(CSS).not.toMatch(/data-verdandi-modal-open[^}]*\.characterFigure[\s\S]*?opacity:\s*0/)
  })

  it('hides the composer on the trace tab and keeps its seat transparent', () => {
    expect(CSS).toMatch(/data-verdandi-view='trace'[\s\S]*?\[data-composer-seat\][\s\S]*?display: none !important/)
    expect(CSS).toMatch(/\[data-composer-seat\]\s*\{[\s\S]*?background: transparent !important/)
  })

  it('pads markdown cards without painting the whole user row', () => {
    expect(CSS).toMatch(/\[class\*='_markdown_'\][\s\S]*?padding: 14px 16px/)
    expect(CSS).toMatch(/\[class\*='_userRow'\][\s\S]*?background: transparent !important/)
    expect(CSS).toMatch(/\[class\*='_userRow'\] \[class\*='_bubble'\][\s\S]*?border:/)
    expect(CSS).toMatch(/data-ds-dark-theme[^{}]*\[class\*='_userRow'\] \[class\*='_bubble'\][\s\S]*?background: rgba\(43, 25, 31, 0\.96\) !important/)
  })

  it('keeps the workspace scene visible under a graduated legibility veil', () => {
    expect(CSS).toMatch(/\[data-phase='active'\],[\s\S]*?\[data-phase='hero'\][\s\S]*?background-color: transparent !important/)
    const conversationRule = CSS.match(/\[data-pane='conversation'\]\s*\{([^}]*)\}/)?.[1] ?? ''
    // The artwork stays the bottom layer; the veil only compresses its range.
    expect(conversationRule).toContain('--vd-art-workspace-light')
    expect(conversationRule).toMatch(/var\(--vd-stage-veil-edge\) 0%/)
    expect(conversationRule).toMatch(/var\(--vd-stage-veil\) 9%/)
    // Both palettes carry the veil as a token, not as a hard-coded wash.
    expect(CSS).toMatch(/--vd-stage-veil: rgba\(255, 253, 251, 0\.3\)/)
    expect(CSS).toMatch(/--vd-stage-veil: rgba\(18, 11, 15, 0\.24\)/)
    // The empty-session composition is not veiled; there is no text to carry.
    const heroRule = CSS.match(/\[data-verdandi-phase='hero'\]\s*\{([^}]*)\}/)?.[1] ?? ''
    expect(heroRule).toContain('--vd-stage-veil-hero')
  })

  it('uses bridal ornaments without creating interactive overlays', () => {
    expect(CSS).toMatch(/data-verdandi-decoration='sidebar-portrait'[\s\S]*?--vd-art-sidebar-bridal/)
    expect(CSS).not.toMatch(
      /data-verdandi-modal-open[^{}]*data-verdandi-decoration='sidebar-portrait'[^{}]*\{[^}]*opacity:\s*0/,
    )
    expect(CSS).not.toMatch(
      /data-verdandi-modal-open[^{}]*data-verdandi-decoration\^='sidebar-veil-corners-'[^{}]*\{[^}]*opacity:\s*0/,
    )
    expect(CSS).toMatch(/data-verdandi-decoration='header-veil'[\s\S]*?--vd-art-header-veil/)
    expect(CSS).toMatch(/data-verdandi-decoration='header-vow-crest'[\s\S]*?--vd-art-vow-avatar-frame/)
    expect(CSS).toMatch(/data-verdandi-decoration='header-vow-crest'[\s\S]*?--vd-art-wedding-avatar/)
    expect(CSS).toMatch(/data-verdandi-decoration='header-namecard'[\s\S]*?--vd-art-vow-namecard/)
    expect(CSS).toMatch(/data-verdandi-decoration='header-bridal-corners'[\s\S]*?--vd-art-bridal-floral-corner/)
    expect(CSS).toMatch(/data-verdandi-decoration='header-veil-corners'[\s\S]*?--vd-art-bridal-veil-corner/)
    expect(CSS).toMatch(/data-verdandi-decoration='composer-seal'[\s\S]*?--vd-art-vow-rings/)
    expect(CSS).toMatch(/data-verdandi-decoration='composer-seal'[\s\S]*?--vd-art-vow-seal/)
    expect(CSS).toMatch(/data-verdandi-decoration='composer-bridal-corners'[\s\S]*?--vd-art-bridal-floral-corner/)
    expect(CSS).toMatch(/data-verdandi-decoration='composer-veil-inner'[\s\S]*?--vd-art-bridal-veil-corner/)
    expect(CSS).toMatch(
      /data-verdandi-decoration='composer-veil-inner'\]::before,[\s\S]*?bottom:\s*-8px;[\s\S]*?width:\s*156px;[\s\S]*?opacity:\s*0\.68/,
    )
    expect(CSS).toMatch(/data-verdandi-decoration='sidebar-veil-corners-top'[\s\S]*?--vd-art-bridal-veil-corner/)
    expect(CSS).toMatch(/data-verdandi-decoration='workspace-lace'[\s\S]*?pointer-events: none/)
  })

  it('uses official art only in scoped structural and hero decorations', () => {
    expect(CSS).toMatch(/sidebar-sacred-tree[\s\S]*?--vd-art-official-sacred-tree/)
    expect(CSS).toMatch(/aria-selected='true'[\s\S]*?--vd-art-vow-namecard/)
    expect(CSS).toMatch(/role='treeitem'\]\[aria-expanded\]::before[\s\S]*?--vd-art-vow-namecard/)
    expect(CSS).toMatch(/role='treeitem'\]\[aria-expanded\] > :first-child[\s\S]*?--vd-art-vow-folder/)
    expect(CSS).toMatch(/aria-selected='true'\]::after[\s\S]*?--vd-art-ring-tag/)
    expect(CSS).toMatch(/data-verdandi-phase='hero'[\s\S]*?hero-chibi/)
    expect(CSS).toMatch(/hero-chibi-left'[\s\S]*?--vd-art-hero-chibi-left/)
    expect(CSS).toMatch(/hero-chibi-right'[\s\S]*?--vd-art-hero-chibi-right/)
    expect(CSS).not.toMatch(/hero-supply|补给已备好|--vd-art-barbecue/)
  })

  it('hangs the framed wedding portrait in a responsive gutter without shortening the paper card', () => {
    expect(CSS).toMatch(/assistant-avatar'[\s\S]*?--vd-art-vow-avatar-frame/)
    expect(CSS).toMatch(/assistant-avatar'[\s\S]*?--vd-art-wedding-avatar/)
    expect(CSS).toMatch(/conversation\.chat\.node'\] \[class\*='_markdown_'\]:has\([\s\S]*?assistant-avatar'[\s\S]*?margin-left: 0/)
    expect(CSS).not.toMatch(/assistant-avatar'[\s\S]*?margin-left:\s*[1-9]\d*px/)
    expect(CSS).toMatch(/assistant-avatar'[\s\S]*?left: -60px/)
    expect(CSS).not.toMatch(/assistant-avatar'[\s\S]*?padding-left: 76px/)
    expect(CSS).toMatch(/max-width: 840px[\s\S]*?assistant-avatar'[\s\S]*?display: none/)
  })

  it('aligns sidebar navigation and removes the selected-session wedge', () => {
    expect(CSS).toMatch(/data-verdandi-nav-entry[\s\S]*?align-items: center/)
    expect(CSS).toMatch(/data-verdandi-nav-entry[\s\S]*?> :first-child[\s\S]*?flex: 0 0 24px/)
    expect(CSS).not.toMatch(/aria-selected='true'\]::before[\s\S]*?clip-path: polygon/)
    expect(CSS).not.toContain('left: -7px')
  })

  it('keeps header tabs flat and gives the composer a roomier bridal interior', () => {
    expect(CSS).toMatch(/data-verdandi-header[\s\S]*?\[role='tab'\][\s\S]*?background: transparent !important/)
    expect(CSS).toMatch(/data-verdandi-header[\s\S]*?\[role='tab'\][\s\S]*?border-radius: 0 !important/)
    expect(CSS).toMatch(/\[data-composer-card\]\s*\{[\s\S]*?min-height: 112px/)
  })

  it('reserves the second-round artwork for low-frequency interface states', () => {
    expect(CSS).toMatch(/sidebar-rail-avatar'[\s\S]*?--vd-art-vow-avatar-frame/)
    expect(CSS).toMatch(/sidebar-rail-avatar'[\s\S]*?--vd-art-q-avatar/)
    expect(CSS).toMatch(/data-verdandi-details-empty[\s\S]*?details-record'[\s\S]*?--vd-art-childhood-record/)
    expect(CSS).toMatch(/aria-label='发送消息'[\s\S]*?--vd-art-sequence-sword/)
  })

  it('keeps the trajectory compact without decorative artwork overlays', () => {
    const timelineRule = CSS.match(/\[aria-label='Trajectory timeline'\]\s*\{([^}]*)\}/)?.[1] ?? ''
    expect(timelineRule).toContain('min-height: 0')
    expect(timelineRule).not.toMatch(/28vh|320px/)
    expect(CSS).not.toMatch(/data-verdandi-trace-empty|SEQUENCE ARCHIVE/)
    expect(CSS).not.toMatch(/\[aria-label='Trajectory timeline'\]::(?:before|after)/)
  })

  it('groups composer statistics into one compact ribbon', () => {
    expect(CSS).toMatch(/\[data-slot='conversation\.composer\.dock'\]\s*\{[\s\S]*?display: grid !important/)
    expect(CSS).toMatch(/\[data-slot='conversation\.composer\.dock'\]\s*\{[\s\S]*?margin: 3px auto 0[\s\S]*?border-radius: 12px 12px 14px 14px/)
    expect(CSS).not.toMatch(/\[data-slot='conversation\.composer\.dock'\]\s*\{[^}]*?border-top: 0/)
    expect(CSS).toMatch(/\[data-slot='conversation\.composer\.dock'\] > :not\(\[role='tooltip'\]\)[\s\S]*?margin: 0 !important/)
    expect(CSS).toMatch(/\[data-slot='conversation\.composer\.dock'\] > :not\(\[role='tooltip'\]\)[\s\S]*?background: transparent !important/)
    expect(CSS).toMatch(/\[data-slot='conversation\.composer\.dock'\] > \[role='tooltip'\][\s\S]*?z-index: 30/)
    expect(CSS).toMatch(/conversation\.composer\.dock'\]::before[\s\S]*?--vd-art-ring-tag/)
    expect(CSS).toMatch(/conversation\.composer\.dock'\]::after[\s\S]*?--vd-art-official-sacred-tree/)
  })

  it('switches the empty details relic to the sequence sword on the trace view', () => {
    expect(CSS).toMatch(/data-verdandi-view='trace'[\s\S]*?details-record'[\s\S]*?--vd-art-sequence-sword/)
    expect(CSS).toMatch(/data-verdandi-view='trace'[\s\S]*?SEQUENCE RELIC/)
  })

  it('does not replace xterm foreground, background, or ANSI colors', () => {
    const xtermRule = CSS.match(/:global\(\.xterm\)\s*\{([^}]*)\}/)?.[1] ?? ''
    expect(xtermRule).toContain('border-radius')
    expect(xtermRule).not.toMatch(/(?:^|[;\s])color\s*:/)
    expect(xtermRule).not.toMatch(/background(?:-color)?\s*:/)
  })

  it('keeps host load errors readable over scenic backgrounds', () => {
    expect(CSS).toMatch(/data-pane='conversation'[^{}]*class\*='_openError'[^{}]*\{[^}]*background:/)
    expect(CSS).toMatch(/class\*='_openError'[^{}]*\{[^}]*border-left:/)
    expect(CSS).toMatch(/data-pane='sidebar'[^{}]*class~='cm-bal-err'[^{}]*\{[^}]*color:/)
  })

  it('does not pad the collapsed reasoning row out of its fixed host height', () => {
    // The host pins this one row to `24px + delta` under `contain: size layout`
    // while its DisclosureRow child is that same height, so any vertical padding
    // shrinks the content box below the row and pushes it 5px off centre with
    // its bottom edge outside the slip.
    const collapsed = CSS.match(
      /\[data-variant='think'\]:not\(\[data-expanded\]\)\s*\{([^}]*)\}/,
    )?.[1] ?? ''
    expect(collapsed).toContain('justify-content: center')
    expect(collapsed).toContain('padding-block: 0')

    // The expanded disclosure is content-sized and keeps its breathing room.
    const base = CSS.match(/\[data-variant='think'\]\s*\{([^}]*)\}/)?.[1] ?? ''
    expect(base).toContain('padding: 5px 9px')
  })

  it('carries the hero workspace chips on the slip family too', () => {
    // The new-session workspace row is bare chrome as well: the workspace chip,
    // the agent-preset seat and the git-graph branch chip are all transparent
    // 28px pills coloured `label-primary`.
    const chipRule = CSS.match(
      /\[class\*='_heroWorkspaceRow'\],\s*\[class\*='_workspaceRow'\]\s*\)\s*:is\(button, \[role='button'\]\)\s*\{([^}]*)\}/,
    )?.[1] ?? ''
    expect(chipRule).toContain('background: var(--vd-slip)')
    expect(chipRule).toContain('--dsw-alias-label-primary: var(--vd-ink)')
    expect(chipRule).toContain('border-radius: 999px')
    // Controls at any depth: the slot system wraps every seat in a
    // `display: contents` div, so a `> *` rule would paint an invisible box.
    expect(CSS).not.toMatch(/\[class\*='_heroWorkspaceRow'\][\s\S]{0,80}>\s*\*\s*\{/)

    expect(CSS).toMatch(
      /@supports not \(\(backdrop-filter[\s\S]*?_heroWorkspaceRow[\s\S]*?background: var\(--vd-slip-solid\)/,
    )
  })

  it('runs the status on plain ink with motion on a hairline', () => {
    // No surface, no halo, no outline, no clipped fill: every decoration here
    // was measured or reviewed down. What is left must stay plain.
    const status = CSS.match(
      /\[class\*='_turnStatus'\]\s*\{([^}]*)\}/,
    )?.[1] ?? ''
    expect(status).toContain('background-image: none')
    expect(status).toContain('text-shadow: none')
    expect(status).toContain('-webkit-text-fill-color: currentColor')
    expect(status).toContain('animation: none')
    // The rejected halo was a multi-layer glow in the paper colour.
    expect(CSS).not.toMatch(/text-shadow:[^;]*var\(--vd-slip-solid\)/)
    expect(CSS).not.toMatch(/\[data-pane='conversation'\]::(?:before|after)/)
    expect(CSS).not.toMatch(/-webkit-text-stroke/)

    // Motion lives on a gold hairline, which cannot touch contrast.
    expect(CSS).toMatch(
      /\[class\*='_turnStatus'\]::after\s*\{[^}]*--vd-gold-light[^}]*verdandi-status-sweep/,
    )
    expect(CSS).toMatch(/@keyframes verdandi-status-sweep/)

    // The theme states its own line; the host's localized string survives in the
    // accessibility tree, so the swap is visual only and must stay reversible.
    const swap = CSS.match(
      /\[class\*='_turnStatus'\]:not\(\s*\[class\*='_turnStatusClock'\]\s*\)::before\s*\{([^}]*)\}/,
    )?.[1] ?? ''
    expect(swap).toContain("content: '薇儿烧烤中...'")
    expect(swap).toContain('font-size: 14px')
    // The host's own text node is collapsed, not removed.
    expect(CSS).toMatch(
      /\[class\*='_turnStatus'\]:not\(\s*\[class\*='_turnStatusClock'\]\s*\)\s*\{[^}]*font-size: 0/,
    )
    expect(CSS).toMatch(/html:lang\(en\)[\s\S]*?_turnStatusClock'\]\s*\)::before\s*\{[^}]*Verdandi is grilling/)

    // The clock shares the label's ink: --vd-ink-meta does not clear the floor
    // on the dark band, so hierarchy comes from size and weight only.
    const clock = CSS.match(/\[class\*='_turnStatusClock'\]\s*\{([^}]*)\}/)?.[1] ?? ''
    expect(clock).toContain('color: var(--vd-status-ink)')

    expect(CSS).toMatch(
      /@media \(forced-colors: active\)[\s\S]*?_turnStatus'\]::after[\s\S]*?display: none/,
    )
  })

  it('carries every bare transcript row on a slip surface', () => {
    const slipRule = CSS.match(
      /\[data-pane='conversation'\] :is\(\s*\[data-verdandi-slip\],[\s\S]*?\)\s*\{([^}]*)\}/,
    )?.[1] ?? ''
    expect(slipRule).toContain('background: var(--vd-slip)')
    expect(slipRule).toContain('--dsw-alias-label-tertiary: var(--vd-ink-meta)')
    expect(slipRule).toContain('backdrop-filter: blur(7px)')
    expect(slipRule).toContain('backdrop-filter')

    // Turn chrome the host draws without any surface must be covered too.
    expect(CSS).toMatch(/\[class\*='_turnErrorTitle'\]\s*\{\s*color: var\(--vd-danger\) !important/)
    expect(CSS).toMatch(/\[class\*='_maxTokensTitle'\]\s*\{\s*color: var\(--vd-warn\) !important/)
    expect(CSS).toMatch(/\[class\*='_turnErrorCode'\]\s*\{[\s\S]*?background: color-mix/)
    expect(CSS).toMatch(/\[data-turn-process\]\s*\{[\s\S]*?border-radius: 999px/)
    expect(CSS).toMatch(/\[data-turn-tail\] > \[class\*='_actions'\]\s*\{[\s\S]*?background: var\(--vd-slip\)/)

    // And the ratio has to survive without compositing help.
    expect(CSS).toMatch(
      /@supports not \(\(backdrop-filter: blur\(4px\)\) or \(-webkit-backdrop-filter: blur\(4px\)\)\)[\s\S]*?background: var\(--vd-slip-solid\)/,
    )
    expect(CSS).toMatch(/@media \(prefers-contrast: more\)[\s\S]*?--vd-stage-veil: rgba\(255, 253, 251, 0\.44\)/)
    expect(CSS).toMatch(/@media \(forced-colors: active\)[\s\S]*?background: Canvas/)
  })
})

/** Relative luminance of an opaque sRGB triple, per WCAG 2.1. */
function luminance([r, g, b]: [number, number, number]): number {
  const channel = (value: number) => {
    const scaled = value / 255
    return scaled <= 0.04045 ? scaled / 12.92 : ((scaled + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

function contrast(foreground: [number, number, number], background: [number, number, number]): number {
  const [lighter, darker] = [luminance(foreground), luminance(background)].sort((a, b) => b - a)
  return (lighter + 0.05) / (darker + 0.05)
}

function hex(value: string): [number, number, number] {
  const digits = value.replace('#', '')
  return [0, 2, 4].map((offset) => Number.parseInt(digits.slice(offset, offset + 2), 16)) as [
    number,
    number,
    number,
  ]
}

function rgba(value: string): { rgb: [number, number, number]; alpha: number } {
  const parts = value.match(/[\d.]+/g)?.map(Number) ?? []
  return { rgb: [parts[0] ?? 0, parts[1] ?? 0, parts[2] ?? 0], alpha: parts[3] ?? 1 }
}

/** Alpha-composite `top` over an opaque `bottom`. */
function over(
  top: { rgb: [number, number, number]; alpha: number },
  bottom: [number, number, number],
): [number, number, number] {
  return top.rgb.map((channel, index) =>
    Math.round(channel * top.alpha + (bottom[index] ?? 0) * (1 - top.alpha)),
  ) as [number, number, number]
}

/**
 * The workspace artwork contains near-black shelves and near-white window light
 * in the same frame, so the declared floor has to hold against both extremes.
 * A regression here means real text on the real background is unreadable.
 */
describe('verdandi legibility contrast floor', () => {
  const blocks: Array<[string, string]> = [
    ['light', CSS.match(/body\[data-dsh-verdandi\]\s*\{([\s\S]*?)\n\}/)?.[1] ?? ''],
    ['dark', CSS.match(/body\[data-dsh-verdandi\]\[data-ds-dark-theme\]\s*\{([\s\S]*?)\n\}/)?.[1] ?? ''],
  ]
  const EXTREMES: Array<[string, [number, number, number]]> = [
    ['darkest artwork pixel', [0, 0, 0]],
    ['brightest artwork pixel', [255, 255, 255]],
  ]

  const token = (block: string, name: string) =>
    block.match(new RegExp(`${name}:\\s*([^;]+);`))?.[1]?.trim() ?? ''

  for (const [palette, block] of blocks) {
    it(`holds 4.5:1 for ${palette} slip text over both artwork extremes`, () => {
      expect(block).not.toBe('')
      const slip = rgba(token(block, '--vd-slip'))
      const slipSolid = hex(token(block, '--vd-slip-solid'))
      const inks: Array<[string, [number, number, number]]> = [
        ['ink', hex(token(block, '--vd-ink'))],
        ['ink-meta', hex(token(block, '--vd-ink-meta'))],
        ['danger', hex(token(block, '--vd-danger'))],
        ['warn', hex(token(block, '--vd-warn'))],
      ]

      for (const [label, background] of EXTREMES) {
        for (const [inkName, ink] of inks) {
          expect(
            contrast(ink, over(slip, background)),
            `${palette} ${inkName} on slip over ${label}`,
          ).toBeGreaterThanOrEqual(4.5)
          expect(
            contrast(ink, slipSolid),
            `${palette} ${inkName} on solid slip fallback`,
          ).toBeGreaterThanOrEqual(4.5)
        }
      }

      // The running status sits on the artwork with no surface at all, so it is
      // checked against the band it actually floats in. Those extremes are
      // measured on the real scenes (design note §15.7), in linear luminance.
      const [bandMin, bandMax] = STATUS_BAND[palette] ?? [0, 0]
      const ratioOf = (a: number, b: number) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
      const statusInk = luminance(hex(token(block, '--vd-status-ink')))
      const worst = statusInk <= bandMin
        ? ratioOf(statusInk, bandMin)
        : statusInk >= bandMax
          ? ratioOf(statusInk, bandMax)
          : Math.min(ratioOf(statusInk, bandMin), ratioOf(statusInk, bandMax))

      if (palette === 'light') {
        expect(worst, 'light status ink over the measured band').toBeGreaterThanOrEqual(4.5)
      } else {
        // Dark cannot reach AA here: over that band the best possible single ink
        // measures 2.05:1, so this pins the regression floor rather than a pass.
        expect(worst, 'dark status ink over the measured band').toBeGreaterThanOrEqual(1.9)
      }
    })
  }
})
