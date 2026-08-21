import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const CSS = readFileSync(resolve(process.cwd(), 'src/client/verdandi.module.css'), 'utf8')

describe('verdandi compatibility guardrails', () => {
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
  })

  it('reveals the workspace scene behind both active and hero surfaces', () => {
    expect(CSS).toMatch(/\[data-phase='active'\],[\s\S]*?\[data-phase='hero'\][\s\S]*?background-color: transparent !important/)
    const conversationRule = CSS.match(/\[data-pane='conversation'\]\s*\{([^}]*)\}/)?.[1] ?? ''
    expect(conversationRule).not.toContain('linear-gradient(90deg')
  })

  it('uses bridal ornaments without creating interactive overlays', () => {
    expect(CSS).toMatch(/data-verdandi-decoration='sidebar-portrait'[\s\S]*?--vd-art-sidebar-bridal/)
    expect(CSS).not.toMatch(
      /data-verdandi-modal-open[^{}]*data-verdandi-decoration='sidebar-portrait'[^{}]*\{[^}]*opacity:\s*0/,
    )
    expect(CSS).toMatch(/data-verdandi-decoration='header-veil'[\s\S]*?--vd-art-header-veil/)
    expect(CSS).toMatch(/data-verdandi-decoration='header-vow-crest'[\s\S]*?--vd-art-vow-avatar-frame/)
    expect(CSS).toMatch(/data-verdandi-decoration='header-vow-crest'[\s\S]*?--vd-art-wedding-avatar/)
    expect(CSS).toMatch(/data-verdandi-decoration='composer-seal'[\s\S]*?--vd-art-vow-rings/)
    expect(CSS).toMatch(/data-verdandi-decoration='composer-seal'[\s\S]*?--vd-art-vow-seal/)
    expect(CSS).toMatch(/data-verdandi-decoration='workspace-lace'[\s\S]*?pointer-events: none/)
  })

  it('uses official art only in scoped structural and hero decorations', () => {
    expect(CSS).toMatch(/sidebar-sacred-tree[\s\S]*?--vd-art-official-sacred-tree/)
    expect(CSS).toMatch(/aria-selected='true'[\s\S]*?--vd-art-vow-namecard/)
    expect(CSS).toMatch(/aria-selected='true'\]::after[\s\S]*?--vd-art-ring-tag/)
    expect(CSS).toMatch(/data-verdandi-phase='hero'[\s\S]*?hero-chibi/)
    expect(CSS).toMatch(/hero-chibi-left'[\s\S]*?--vd-art-hero-chibi-left/)
    expect(CSS).toMatch(/hero-chibi-right'[\s\S]*?--vd-art-hero-chibi-right/)
    expect(CSS).not.toMatch(/hero-supply|补给已备好|--vd-art-barbecue/)
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
})
