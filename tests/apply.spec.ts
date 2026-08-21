import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { apply } from '../src/client/index.js'

class MockContext {
  private disposers: Array<() => void> = []
  constructor(private services: Record<string, unknown> = {}) {}
  get(name: string): unknown {
    return this.services[name]
  }
  effect(fn: () => () => void): void {
    this.disposers.push(fn())
  }
  disposeAll(): void {
    for (const dispose of this.disposers.splice(0)) dispose()
  }
}

describe('verdandi skin apply/dispose contract', () => {
  let ctx: MockContext
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="root">
        <div data-pane="sidebar">
          <button aria-label="新建会话">新会话</button>
          <button>任务看板</button>
          <button>SSH</button>
          <button>技能中心</button>
          <button aria-label="搜索会话"></button>
          <div role="treeitem" aria-expanded="true">AI</div>
          <div role="treeitem" aria-selected="true">Current session</div>
        </div>
        <div data-pane="conversation">
          <div data-slot="conversation.session.header"><header>
            <button role="tab" aria-selected="true">对话</button>
            <button role="tab" aria-selected="false">轨迹</button>
          </header></div>
          <div data-phase="active"></div>
          <div data-chat-flow-kind="assistant-step"><div data-slot="conversation.chat.node">
            <div class="host-assistant-card"><div class="host_markdown_body"><p>Assistant response</p></div></div>
          </div></div>
          <div data-composer-seat><div data-composer-card></div></div>
        </div>
        <aside data-pane="details"><div data-slot="details">详情点击消息流中的工具行查看详情</div></aside>
      </div>`
    ctx = new MockContext()
  })
  afterEach(() => {
    ctx.disposeAll()
  })

  it('sets the skin body attribute and removes it on dispose', () => {
    apply(ctx as never)
    expect(document.body.hasAttribute('data-dsh-verdandi')).toBe(true)
    ctx.disposeAll()
    expect(document.body.hasAttribute('data-dsh-verdandi')).toBe(false)
  })

  it('restores the previous body attribute value', () => {
    document.body.setAttribute('data-dsh-verdandi', 'previous')
    apply(ctx as never)
    expect(document.body.getAttribute('data-dsh-verdandi')).toBe('')
    ctx.disposeAll()
    expect(document.body.getAttribute('data-dsh-verdandi')).toBe('previous')
  })

  it('uses and disposes the official theme token extension when available', () => {
    const disposeTheme = vi.fn()
    const overrideTokens = vi.fn(() => disposeTheme)
    ctx = new MockContext({ theme: { overrideTokens } })

    apply(ctx as never)

    expect(overrideTokens).toHaveBeenCalledWith(
      '@hjbztlbr/dsh-client-ui-skin-verdandi',
      expect.objectContaining({
        '--dsw-alias-brand-primary': { light: '#8e2438', dark: '#e4cfa0' },
        '--dsw-alias-button-primary-fill': { light: '#8e2438', dark: '#e4cfa0' },
      }),
    )
    ctx.disposeAll()
    expect(disposeTheme).toHaveBeenCalledOnce()
  })

  it('removes legacy fixed decorations and mounts the character stage inside conversation', () => {
    document.querySelector('[data-pane="sidebar"]')?.insertAdjacentHTML(
      'beforeend',
      '<div data-verdandi-sidebar-card="" aria-hidden="true"></div>',
    )
    document.body.insertAdjacentHTML(
      'beforeend',
      '<div data-verdandi-wedding=""></div><div data-verdandi-chrome="top"></div>',
    )
    apply(ctx as never)

    const sidebar = document.querySelector('[data-pane="sidebar"]')
    const conversation = document.querySelector('[data-pane="conversation"]')
    expect(sidebar?.querySelector('[data-verdandi-sidebar-card]')).toBeNull()
    expect(document.querySelector('[data-verdandi-wedding]')).toBeNull()
    expect(document.querySelector('[data-verdandi-chrome]')).toBeNull()
    expect(conversation?.querySelector(':scope > [data-verdandi-stage]')).not.toBeNull()
    expect(conversation?.querySelectorAll('[data-verdandi-figure]')).toHaveLength(2)
    expect(conversation?.querySelector("[data-verdandi-figure='left']")).not.toBeNull()
    expect(conversation?.querySelector("[data-verdandi-figure='right']")).not.toBeNull()
    expect(conversation?.querySelector("[data-verdandi-stage] > [data-verdandi-decoration='hero-supply']")).toBeNull()
    expect((conversation?.querySelector('[data-verdandi-stage]') as HTMLElement | null)?.style.getPropertyPriority('display')).toBe('important')
    expect(conversation?.getAttribute('data-verdandi-phase')).toBe('active')
    expect(conversation?.getAttribute('data-verdandi-view')).toBe('chat')
    expect(document.body.hasAttribute('data-verdandi-workspace')).toBe(true)
    expect(sidebar?.querySelector(":scope > [data-verdandi-decoration='sidebar-portrait']")).not.toBeNull()
    expect(sidebar?.querySelector(":scope > [data-verdandi-decoration='sidebar-sacred-tree']")).not.toBeNull()
    expect(sidebar?.querySelector(":scope > [data-verdandi-decoration='sidebar-rail-avatar']")).not.toBeNull()
    expect(sidebar?.querySelector(":scope > [data-verdandi-decoration='sidebar-veil-corners-top']")).not.toBeNull()
    expect(sidebar?.querySelector(":scope > [data-verdandi-decoration='sidebar-veil-corners-bottom']")).not.toBeNull()
    expect(conversation?.querySelector(":scope > [data-verdandi-decoration='workspace-lace']")).not.toBeNull()
    expect(conversation?.querySelector("header > [data-verdandi-decoration='header-veil']")).not.toBeNull()
    expect(conversation?.querySelector("header > [data-verdandi-decoration='header-namecard']")).not.toBeNull()
    expect(conversation?.querySelector("header > [data-verdandi-decoration='header-bridal-corners']")).not.toBeNull()
    expect(conversation?.querySelector("header > [data-verdandi-decoration='header-veil-corners']")).not.toBeNull()
    expect(conversation?.querySelector("header > [data-verdandi-decoration='header-vow-crest']")).not.toBeNull()
    expect(conversation?.querySelector("[data-composer-card] > [data-verdandi-decoration='composer-seal']")).not.toBeNull()
    expect(conversation?.querySelector("[data-composer-card] > [data-verdandi-decoration='composer-bridal-corners']")).not.toBeNull()
    expect(conversation?.querySelector("[data-composer-card] > [data-verdandi-decoration='composer-veil-inner']")).not.toBeNull()
    expect(conversation?.querySelector("[data-composer-card] > [data-verdandi-decoration='hero-chibi-left']")).not.toBeNull()
    expect(conversation?.querySelector("[data-composer-card] > [data-verdandi-decoration='hero-chibi-right']")).not.toBeNull()
    expect(document.querySelector("[data-pane='details'][data-verdandi-details-empty]")).not.toBeNull()
    expect(document.querySelector("[data-pane='details'] > [data-verdandi-decoration='details-record']")).not.toBeNull()
    expect(conversation?.querySelector("[class*='_markdown_'] > [data-verdandi-decoration='assistant-avatar']")).not.toBeNull()

    ctx.disposeAll()
    expect(document.querySelector('[data-verdandi-sidebar-card]')).toBeNull()
    expect(document.querySelector('[data-verdandi-stage]')).toBeNull()
    expect(document.querySelector('[data-verdandi-decoration]')).toBeNull()
  })

  it('selects the trajectory view without tagging host timeline content', () => {
    const conversation = document.querySelector('[data-pane="conversation"]')
    conversation?.querySelector('[role="tab"][aria-selected="true"]')?.setAttribute('aria-selected', 'false')
    const traceTab = Array.from(conversation?.querySelectorAll('[role="tab"]') ?? [])
      .find((tab) => tab.textContent === '轨迹')
    traceTab?.setAttribute('aria-selected', 'true')
    conversation?.insertAdjacentHTML(
      'beforeend',
      '<section aria-label="Trajectory timeline">No timing data</section>',
    )

    apply(ctx as never)

    expect(conversation?.getAttribute('data-verdandi-view')).toBe('trace')
    expect(conversation?.querySelector("[aria-label='Trajectory timeline']")?.textContent).toBe('No timing data')
    expect(conversation?.querySelector('[data-verdandi-trace-empty]')).toBeNull()
  })

  it('adds semantic hooks without replacing host controls', () => {
    apply(ctx as never)

    expect(document.querySelector('button[data-verdandi-new-session]')?.textContent).toBe('新会话')
    expect(Array.from(document.querySelectorAll('button[data-verdandi-nav-entry]')).map((button) => button.textContent)).toEqual([
      '任务看板',
      'SSH',
      '技能中心',
    ])
    expect(document.querySelector('button[data-verdandi-sidebar-action]')?.getAttribute('aria-label')).toBe('搜索会话')
    expect(document.querySelector('[data-verdandi-header]')).not.toBeNull()

    ctx.disposeAll()
    expect(document.querySelector('[data-verdandi-new-session]')).toBeNull()
    expect(document.querySelector('[data-verdandi-header]')).toBeNull()
  })

  it('restores pre-existing asset properties on dispose', () => {
    document.body.style.setProperty('--vd-art-character-right', 'url(previous.png)')
    document.body.style.setProperty('--vd-art-sidebar-bridal', 'url(previous-sidebar.png)')
    apply(ctx as never)
    expect(document.body.style.getPropertyValue('--vd-art-character-right')).toContain('data:image/webp')
    expect(document.body.style.getPropertyValue('--vd-art-sidebar-bridal')).toContain('data:image/webp')

    ctx.disposeAll()
    expect(document.body.style.getPropertyValue('--vd-art-character-right')).toBe('url(previous.png)')
    expect(document.body.style.getPropertyValue('--vd-art-sidebar-bridal')).toBe('url(previous-sidebar.png)')
    expect(document.querySelector('[data-pane="conversation"]')?.hasAttribute('data-verdandi-phase')).toBe(false)
    expect(document.querySelector('[data-pane="conversation"]')?.hasAttribute('data-verdandi-view')).toBe(false)
  })
})
