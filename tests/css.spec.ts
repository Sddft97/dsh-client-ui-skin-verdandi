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
    expect(CSS).toMatch(/data-verdandi-decoration='composer-seal'[\s\S]*?--vd-art-vow-seal/)
    expect(CSS).toMatch(/data-verdandi-decoration='workspace-lace'[\s\S]*?pointer-events: none/)
  })

  it('does not replace xterm foreground, background, or ANSI colors', () => {
    const xtermRule = CSS.match(/:global\(\.xterm\)\s*\{([^}]*)\}/)?.[1] ?? ''
    expect(xtermRule).toContain('border-radius')
    expect(xtermRule).not.toMatch(/(?:^|[;\s])color\s*:/)
    expect(xtermRule).not.toMatch(/background(?:-color)?\s*:/)
  })
})
