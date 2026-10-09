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

/**
 * The dsh 0.2.0-rc.2 shell.
 *
 * Two things changed and both are load-bearing here: the frame is three columns
 * (`_sidebarCol` / `_centerCol` / `_rightbarCol`) with no `data-pane` region
 * attribute at all, and the conversation lives under the `main.conversation`
 * slot while the right-hand panel is a `[data-sidebar-right-panel]` occupant.
 * Every region therefore has to be derived and stamped by the runtime.
 */
const SHELL_2X = `
  <div id="root"><div data-slot="root" style="display:contents"><div class="pI_x6G_frame">
    <div class="pI_x6G_sidebarCol">
      <div data-slot="sidebar" style="display:contents"><div class="hHd-Xa_root">
        <button class="hHd-Xa_newSession"><span class="hHd-Xa_newSessionContent">新会话</span></button>
        <nav class="hHd-Xa_panelList"><button class="hHd-Xa_panelRow"><span class="hHd-Xa_panelTitle">插件</span></button></nav>
        <button aria-label="搜索会话"></button>
        <div role="treeitem" aria-expanded="true">AI</div>
        <div role="treeitem" aria-selected="true">Current session</div>
        <div data-slot="sidebar.settings" style="display:contents"></div>
      </div></div>
    </div>
    <div class="pI_x6G_centerCol"><div data-slot="main" style="display:contents">
      <div data-slot="main.conversation" style="display:contents">
        <div class="wSkVaW_root" data-phase="active">
          <div data-slot="conversation.header" style="display:contents"><header class="wSkVaW_header">
            <div data-slot="conversation.session.header" style="display:contents">
              <div class="wSkVaW_titleRow">
                <button role="tab" aria-selected="true">对话</button>
                <button role="tab" aria-selected="false">轨迹</button>
              </div>
            </div>
          </header></div>
          <div class="wSkVaW_body" data-conversation-content data-conversation-region="chat" data-content-phase="active">
            <div data-chat-flow-kind="assistant-step"><div data-slot="conversation.chat.node">
              <div class="host-assistant-card"><div class="host_markdown_body"><p>Assistant response</p></div></div>
            </div></div>
            <div data-chat-flow-kind="system-prompt" data-chat-flow-key="system-prompt">
              <div data-slot="conversation.chat.node">
                <div class="host_context_row">
                  <button>系统提示词</button>
                  <div data-system-prompt-body>PROMPT</div>
                </div>
              </div>
            </div>
            <div data-chat-flow-kind="context" data-chat-flow-key="context">
              <div data-slot="conversation.chat.node">
                <div class="host_notice_row">
                  <span data-context-source>工具变更</span>
                  <span data-context-summary>+2 / -1</span>
                </div>
              </div>
            </div>
            <div data-composer-seat data-conversation-region="composer"><div data-composer-card></div></div>
          </div>
        </div>
      </div>
    </div></div>
    <div class="pI_x6G_rightbarCol"><div data-slot="rightbar" style="display:contents">
      <div class="P3OORG_session"><div class="P3OORG_panel" data-sidebar-right-panel="push" data-sidebar-right-open="true">
        <div class="P3OORG_panelBody"><div data-dockkit-empty><section data-dockkit-pane="pane1">空面板</section></div></div>
      </div></div>
    </div></div>
  </div></div></div>`

/** The 0.1.x shell: `data-pane` regions, which the resolvers must still accept. */
const SHELL_1X = `
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
      <div data-slot="conversation.header" style="display:contents"><header>
        <div data-slot="conversation.session.header" style="display:contents">
          <div class="host_titleRow">
            <button role="tab" aria-selected="true">对话</button>
            <button role="tab" aria-selected="false">轨迹</button>
          </div>
        </div>
      </header></div>
      <div data-phase="active"></div>
      <div data-chat-flow-kind="assistant-step"><div data-slot="conversation.chat.node">
        <div class="host-assistant-card"><div class="host_markdown_body"><p>Assistant response</p></div></div>
      </div></div>
      <div data-chat-flow-kind="system-prompt" data-chat-flow-key="system-prompt">
        <div data-slot="conversation.chat.node">
          <div class="host_context_row">
            <button class="host_context_title">系统提示词</button>
            <div data-system-prompt-body>PROMPT</div>
          </div>
        </div>
      </div>
      <div data-chat-flow-kind="context" data-chat-flow-key="context">
        <div data-slot="conversation.chat.node">
          <div class="host_notice_row">
            <span data-context-source>工具变更</span>
            <span data-context-summary>+2 / -1</span>
          </div>
        </div>
      </div>
      <div data-composer-seat><div data-composer-card></div></div>
    </div>
    <aside data-pane="details"><div data-slot="details">详情点击消息流中的工具行查看详情</div></aside>
  </div>`

/** Shells before 0.1.7: the header is the child of the session-header anchor. */
const LEGACY_HEADER = `<div data-slot="conversation.session.header" style="display:contents"><header>
  <div class="host_titleRow"><button role="tab" aria-selected="true">对话</button></div>
</header></div>`

/** Region lookups go through the skin's own stamp, which is what the CSS uses. */
const region = (name: string) => document.querySelector<HTMLElement>(`[data-verdandi-pane='${name}']`)

describe('verdandi skin apply/dispose contract', () => {
  let ctx: MockContext
  beforeEach(() => {
    document.body.innerHTML = SHELL_2X
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

  it('derives every region on the 0.2.0 shell, which emits no data-pane', () => {
    // The whole adaptation hinges on this: the shell dropped the region
    // attribute, so the skin must resolve the frame columns and slots itself.
    expect(document.querySelector('[data-pane]')).toBeNull()
    apply(ctx as never)

    const sidebar = region('sidebar')
    const conversation = region('conversation')
    const details = region('details')

    expect(sidebar?.classList.contains('pI_x6G_sidebarCol')).toBe(true)
    expect(conversation?.classList.contains('wSkVaW_root')).toBe(true)
    expect(details?.classList.contains('P3OORG_panel')).toBe(true)

    // The `display: contents` slot anchors must never win over the boxed element.
    expect(sidebar?.getAttribute('data-slot')).toBeNull()
    expect(conversation?.getAttribute('data-slot')).toBeNull()

    ctx.disposeAll()
    expect(document.querySelector('[data-verdandi-pane]')).toBeNull()
  })

  it('resolves the same regions on the older data-pane shell', () => {
    document.body.innerHTML = SHELL_1X
    ctx = new MockContext()
    apply(ctx as never)

    expect(region('sidebar')?.getAttribute('data-pane')).toBe('sidebar')
    expect(region('conversation')?.getAttribute('data-pane')).toBe('conversation')
    expect(region('details')?.getAttribute('data-pane')).toBe('details')
  })

  it('removes legacy fixed decorations and mounts the character stage inside conversation', () => {
    region('sidebar')?.insertAdjacentHTML(
      'beforeend',
      '<div data-verdandi-sidebar-card="" aria-hidden="true"></div>',
    )
    document.body.insertAdjacentHTML(
      'beforeend',
      '<div data-verdandi-wedding=""></div><div data-verdandi-chrome="top"></div>',
    )
    apply(ctx as never)

    const sidebar = region('sidebar')
    const conversation = region('conversation')
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

    // The sidebar decorations hang off the slot anchor, which is where the
    // stylesheet looks for them.
    const sidebarAnchor = sidebar?.querySelector("[data-slot='sidebar']")
    expect(sidebarAnchor?.querySelector(":scope > [data-verdandi-decoration='sidebar-portrait']")).not.toBeNull()
    expect(sidebarAnchor?.querySelector(":scope > [data-verdandi-decoration='sidebar-sacred-tree']")).not.toBeNull()
    expect(sidebarAnchor?.querySelector(":scope > [data-verdandi-decoration='sidebar-rail-avatar']")).not.toBeNull()
    expect(sidebarAnchor?.querySelector(":scope > [data-verdandi-decoration='sidebar-veil-corners-top']")).not.toBeNull()
    expect(sidebarAnchor?.querySelector(":scope > [data-verdandi-decoration='sidebar-veil-corners-bottom']")).not.toBeNull()
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

    // The right-hand panel is the details region now, and its empty state is the
    // docking kit's empty host rather than the old tool-row prompt.
    const details = region('details')
    expect(details?.hasAttribute('data-verdandi-details-empty')).toBe(true)
    expect(details?.querySelector(":scope > [data-verdandi-decoration='details-record']")).not.toBeNull()
    expect(conversation?.querySelector("[class*='_markdown_'] > [data-verdandi-decoration='assistant-avatar']")).not.toBeNull()

    ctx.disposeAll()
    expect(document.querySelector('[data-verdandi-sidebar-card]')).toBeNull()
    expect(document.querySelector('[data-verdandi-stage]')).toBeNull()
    expect(document.querySelector('[data-verdandi-decoration]')).toBeNull()
  })

  it('keeps the details relic off a populated right-hand panel', () => {
    // Mutated before apply: the stamp only exists once the runtime has resolved.
    const panel = document.querySelector<HTMLElement>('[data-sidebar-right-panel]')
    panel?.querySelector('[data-dockkit-empty]')?.remove()
    panel?.insertAdjacentHTML('beforeend', '<div class="P3OORG_tabBody">工具详情</div>')

    apply(ctx as never)

    expect(region('details')?.hasAttribute('data-verdandi-details-empty')).toBe(false)
  })

  it('leaves the closed right-hand panel unpainted', () => {
    // The host keeps the panel mounted and absolutely positioned over the
    // conversation, hiding it by translating its contents away; the panel itself
    // stays transparent. Painting it while closed covered 391px of a 1069px
    // window with an opaque blank slab, so a closed panel must not be stamped.
    const panel = document.querySelector<HTMLElement>('[data-sidebar-right-panel]')
    panel?.removeAttribute('data-sidebar-right-open')

    apply(ctx as never)

    expect(region('details')).toBeNull()
    expect(document.querySelector("[data-verdandi-pane='details']")).toBeNull()
  })

  it('stamps the right-hand panel once the host opens it', () => {
    const panel = document.querySelector<HTMLElement>('[data-sidebar-right-panel]')
    panel?.removeAttribute('data-sidebar-right-open')
    apply(ctx as never)
    expect(region('details')).toBeNull()

    // Opening flips the host marker; the observer must re-resolve the region.
    panel?.setAttribute('data-sidebar-right-open', 'true')
    return new Promise<void>((resolve) => {
      // The sync is scheduled on a frame (or a timeout fallback in jsdom).
      setTimeout(() => {
        expect(region('details')).toBe(panel)
        ctx.disposeAll()
        expect(document.querySelector("[data-verdandi-pane='details']")).toBeNull()
        resolve()
      }, 60)
    })
  })

  it('leaves an aria-hidden right-hand panel unpainted', () => {
    const panel = document.querySelector<HTMLElement>('[data-sidebar-right-panel]')
    panel?.setAttribute('aria-hidden', 'true')

    apply(ctx as never)

    expect(region('details')).toBeNull()
  })

  it('selects the trajectory view without tagging host timeline content', () => {
    const conversation = document.querySelector<HTMLElement>('.wSkVaW_root')
    conversation?.querySelector('[role="tab"][aria-selected="true"]')?.setAttribute('aria-selected', 'false')
    const traceTab = Array.from(conversation?.querySelectorAll('[role="tab"]') ?? [])
      .find((tab) => tab.textContent === '轨迹')
    traceTab?.setAttribute('aria-selected', 'true')
    conversation?.insertAdjacentHTML(
      'beforeend',
      '<section aria-label="Trajectory timeline">No timing data</section>',
    )

    apply(ctx as never)

    expect(region('conversation')?.getAttribute('data-verdandi-view')).toBe('trace')
    expect(conversation?.querySelector("[aria-label='Trajectory timeline']")?.textContent).toBe('No timing data')
    expect(conversation?.querySelector('[data-verdandi-trace-empty]')).toBeNull()
  })

  it('slips the system-prompt row and releases it on dispose', () => {
    apply(ctx as never)

    // Only the marker-driven rows need a runtime hook; the rest of the slip
    // family is addressed by CSS-stable host attributes and class suffixes.
    expect(document.querySelector('.host_context_row')?.getAttribute('data-verdandi-slip')).toBe('context')
    expect(document.querySelector('.host-assistant-card')?.hasAttribute('data-verdandi-slip')).toBe(false)
    // The context / tool-change notice carries no stable class either: only its
    // disclosure's two semantic attributes, which the marker list now includes.
    expect(document.querySelector('.host_notice_row')?.getAttribute('data-verdandi-slip')).toBe('context')

    ctx.disposeAll()
    expect(document.querySelector('[data-verdandi-slip]')).toBeNull()
  })

  it('marks the header through the 0.1.7 slot and still resolves the older one', () => {
    // 0.1.7 puts the header inside `[data-slot='conversation.header']` and keeps
    // `conversation.session.header` for the display:contents anchor inside it, so
    // the old `…session.header] > header` child no longer exists and every
    // `[data-verdandi-header]` rule was dead.
    apply(ctx as never)

    const inner = document.querySelector('header')
    expect(inner?.hasAttribute('data-verdandi-header')).toBe(true)
    expect(inner?.querySelector("[data-verdandi-decoration='header-veil']")).not.toBeNull()

    // Older shells: the header is the child of the session-header anchor itself.
    // The legacy tree is parsed, not moved node by node: jsdom stops indexing a
    // subtree that was detached inside a `display: contents` parent.
    const conversation = region('conversation')
    expect(conversation).not.toBeNull()
    conversation!.innerHTML = LEGACY_HEADER

    // A fresh context, like a second mount against the older shell's DOM.
    ctx = new MockContext()
    apply(ctx as never)
    const legacyHeader = conversation?.querySelector('header')
    expect(legacyHeader?.hasAttribute('data-verdandi-header')).toBe(true)
    expect(legacyHeader?.querySelector("[data-verdandi-decoration='header-veil']")).not.toBeNull()
    ctx.disposeAll()
  })

  it('adds semantic hooks without replacing host controls', () => {
    apply(ctx as never)

    // 0.2.0 rebuilt the sidebar: the new-session button is `_newSession` and the
    // global navigation entries are `_panelRow`, both matched by class suffix.
    expect(document.querySelector('button[data-verdandi-new-session]')?.textContent).toContain('新会话')
    expect(Array.from(document.querySelectorAll('button[data-verdandi-nav-entry]')).map((button) => button.textContent)).toEqual([
      '插件',
    ])
    expect(document.querySelector('button[data-verdandi-sidebar-action]')?.getAttribute('aria-label')).toBe('搜索会话')
    expect(document.querySelector('[data-verdandi-header]')).not.toBeNull()

    ctx.disposeAll()
    expect(document.querySelector('[data-verdandi-new-session]')).toBeNull()
    expect(document.querySelector('[data-verdandi-nav-entry]')).toBeNull()
    expect(document.querySelector('[data-verdandi-header]')).toBeNull()
  })

  it('still hooks the older sidebar wording', () => {
    document.body.innerHTML = SHELL_1X
    ctx = new MockContext()
    apply(ctx as never)

    expect(document.querySelector('button[data-verdandi-new-session]')?.textContent).toBe('新会话')
    expect(Array.from(document.querySelectorAll('button[data-verdandi-nav-entry]')).map((button) => button.textContent)).toEqual([
      '任务看板',
      'SSH',
      '技能中心',
    ])
  })

  it('marks the live running row the 0.2.0 shell renders instead of turn-process', () => {
    // Seeded before apply: the runtime marks rows it finds during a sync.
    const conversation = document.querySelector<HTMLElement>('.wSkVaW_root')
    conversation?.insertAdjacentHTML(
      'beforeend',
      '<div class="EvIC1a_running" data-chat-running><span class="EvIC1a_runningContent">' +
        '<span class="EvIC1a_runningText">深度求索中，用时 3秒 ...</span></span></div>',
    )
    // A settled turn keeps the host wording: only the live row may be marked.
    conversation?.insertAdjacentHTML(
      'beforeend',
      '<button class="l_V-RG_root" data-turn-process="2"><span class="l_V-RG_label">已完成</span></button>',
    )

    apply(ctx as never)

    expect(conversation?.querySelector('[data-chat-running]')?.hasAttribute('data-verdandi-running')).toBe(true)
    expect(conversation?.querySelector('[data-turn-process]')?.hasAttribute('data-verdandi-running')).toBe(false)

    ctx.disposeAll()
    expect(document.querySelector('[data-verdandi-running]')).toBeNull()
  })

  it('restores pre-existing asset properties on dispose', () => {
    document.body.style.setProperty('--vd-art-character-right', 'url(previous.png)')
    document.body.style.setProperty('--vd-art-sidebar-bridal', 'url(previous-sidebar.png)')
    apply(ctx as never)
    expect(document.body.style.getPropertyValue('--vd-art-character-right')).toContain('data:image/webp')
    expect(document.body.style.getPropertyValue('--vd-art-sidebar-bridal')).toContain('data:image/webp')

    const conversation = region('conversation')
    ctx.disposeAll()
    expect(document.body.style.getPropertyValue('--vd-art-character-right')).toBe('url(previous.png)')
    expect(document.body.style.getPropertyValue('--vd-art-sidebar-bridal')).toBe('url(previous-sidebar.png)')
    expect(conversation?.hasAttribute('data-verdandi-phase')).toBe(false)
    expect(conversation?.hasAttribute('data-verdandi-view')).toBe(false)
  })
})
