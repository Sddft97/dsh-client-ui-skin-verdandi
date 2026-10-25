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

/** Shells before 0.1.7: the header is the child of the session-header anchor. */
const LEGACY_HEADER = `<div data-slot="conversation.session.header" style="display:contents"><header>
  <div class="host_titleRow"><button role="tab" aria-selected="true">对话</button></div>
</header></div>`

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

const sidebarPane = () => document.querySelector<HTMLElement>("[data-pane='sidebar'], .pI_x6G_sidebarCol")
const conversationPane = () => document.querySelector<HTMLElement>("[data-pane='conversation'], .wSkVaW_root")
const region = (name: string) => document.querySelector<HTMLElement>(`[data-verdandi-pane='${name}']`)

/** Run the observer and its scheduled animation frame. */
const settle = async (): Promise<void> => {
  for (let i = 0; i < 4; i += 1) await new Promise((resolve) => setTimeout(resolve, 5))
}

describe.each([['0.1.x', SHELL_1X], ['0.2.0-rc.2', SHELL_2X]])('%s apply/dispose contract', (_version, shell) => {
  let ctx: MockContext
  beforeEach(() => {
    document.body.removeAttribute('data-dsh-verdandi')
    document.body.innerHTML = shell
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
    sidebarPane()?.insertAdjacentHTML(
      'beforeend',
      '<div data-verdandi-sidebar-card="" aria-hidden="true"></div>',
    )
    document.body.insertAdjacentHTML(
      'beforeend',
      '<div data-verdandi-wedding=""></div><div data-verdandi-chrome="top"></div>',
    )
    apply(ctx as never)

    const sidebar = sidebarPane()
    const conversation = conversationPane()
    const sidebarRoot = sidebar?.querySelector("[data-slot='sidebar']") ?? sidebar
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
    expect(sidebarRoot?.querySelector(":scope > [data-verdandi-decoration='sidebar-portrait']")).not.toBeNull()
    expect(sidebarRoot?.querySelector(":scope > [data-verdandi-decoration='sidebar-sacred-tree']")).not.toBeNull()
    expect(sidebarRoot?.querySelector(":scope > [data-verdandi-decoration='sidebar-rail-avatar']")).not.toBeNull()
    expect(sidebarRoot?.querySelector(":scope > [data-verdandi-decoration='sidebar-veil-corners-top']")).not.toBeNull()
    expect(sidebarRoot?.querySelector(":scope > [data-verdandi-decoration='sidebar-veil-corners-bottom']")).not.toBeNull()
    expect(conversation?.querySelector(":scope > [data-verdandi-decoration='workspace-lace']")).not.toBeNull()
    expect(conversation?.querySelector("header > [data-verdandi-decoration='header-veil']")).not.toBeNull()
    // The drag handle that gives window dragging back on the desktop shell, where the
    // top bar is an Electron drag region and the layers above it opt out of it.
    expect(conversation?.querySelector("header > [data-verdandi-decoration='header-drag-strip']")).not.toBeNull()
    expect(conversation?.querySelector("header > [data-verdandi-decoration='header-namecard']")).not.toBeNull()
    expect(conversation?.querySelector("header > [data-verdandi-decoration='header-bridal-corners']")).not.toBeNull()
    expect(conversation?.querySelector("header > [data-verdandi-decoration='header-veil-corners']")).not.toBeNull()
    expect(conversation?.querySelector("header > [data-verdandi-decoration='header-vow-crest']")).not.toBeNull()
    expect(conversation?.querySelector("[data-composer-card] > [data-verdandi-decoration='composer-seal']")).not.toBeNull()
    expect(conversation?.querySelector("[data-composer-card] > [data-verdandi-decoration='composer-bridal-corners']")).not.toBeNull()
    expect(conversation?.querySelector("[data-composer-card] > [data-verdandi-decoration='composer-veil-inner']")).not.toBeNull()
    expect(conversation?.querySelector("[data-composer-card] > [data-verdandi-decoration='hero-chibi-left']")).not.toBeNull()
    expect(conversation?.querySelector("[data-composer-card] > [data-verdandi-decoration='hero-chibi-right']")).not.toBeNull()
    expect(region('details')?.hasAttribute('data-verdandi-details-empty')).toBe(true)
    expect(region('details')?.querySelector(":scope > [data-verdandi-decoration='details-record']")).not.toBeNull()
    expect(conversation?.querySelector("[class*='_markdown_'] > [data-verdandi-decoration='assistant-avatar']")).not.toBeNull()

    ctx.disposeAll()
    expect(document.querySelector('[data-verdandi-sidebar-card]')).toBeNull()
    expect(document.querySelector('[data-verdandi-stage]')).toBeNull()
    expect(document.querySelector('[data-verdandi-decoration]')).toBeNull()
  })

  it('only mounts the drag handle where the shell has a window-drag region', () => {
    // The shell's drag-region rules are platform-gated (`[data-platform="darwin"]`), so a
    // platform whose window has a native title bar leaves `-webkit-app-region` unused.
    // A band the host never reserved must not be invented there -- it could swallow
    // clicks in an area the shell never handed over.
    const original = window.getComputedStyle
    window.getComputedStyle = ((el: Element, pseudo?: string | null) => {
      const style = original(el, pseudo ?? undefined)
      if (el.tagName === 'HEADER') {
        return Object.create(style, { webkitAppRegion: { value: 'no-drag' } }) as CSSStyleDeclaration
      }
      return style
    }) as typeof window.getComputedStyle
    try {
      apply(ctx as never)
      expect(document.querySelector("[data-verdandi-decoration='header-drag-strip']")).toBeNull()
      // ...while the rest of the header decoration is untouched.
      expect(document.querySelector("[data-verdandi-decoration='header-veil']")).not.toBeNull()
    } finally {
      window.getComputedStyle = original
    }
  })

  it('selects the trajectory view without tagging host timeline content', () => {
    const conversation = conversationPane()
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
    const conversation = conversationPane()
    expect(conversation).not.toBeNull()
    ctx.disposeAll()
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

    expect(document.querySelector('button[data-verdandi-new-session]')?.textContent).toBe('新会话')
    expect(Array.from(document.querySelectorAll('button[data-verdandi-nav-entry]')).map((button) => button.textContent)).toEqual(shell === SHELL_1X ? [
      '任务看板',
      'SSH',
      '技能中心',
    ] : [])
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
    expect(conversationPane()?.hasAttribute('data-verdandi-phase')).toBe(false)
    expect(conversationPane()?.hasAttribute('data-verdandi-view')).toBe(false)
    expect(document.querySelector('[data-verdandi-pane]')).toBeNull()
  })

  // The running line: the host mounts a node of its own and the skin takes it over.
  // The class names below are deliberately arbitrary — nothing in the takeover may
  // depend on them, only on `data-chat-running` and on the phrase itself.
  const RUNNING_HOST = `
    <div data-chat-running>
      <span role="status" aria-live="polite" aria-atomic="true">深度求索中</span>
      <span class="whatever_dividerHostish"></span>
      <span class="whatever_contentHostish">
        <span class="whatever_iconHostish"><span class="whatever_whaleHostish"></span></span>
        <span class="whatever_textHostish"><span class="whatever_leafHostish">深度求索中，用时 20 秒 ···</span></span>
      </span>
    </div>`

  const addRunningHost = (markup = RUNNING_HOST): HTMLElement => {
    const pane = conversationPane()!
    pane.insertAdjacentHTML('beforeend', markup)
    return pane.lastElementChild as HTMLElement
  }

  it('takes the running line over and keeps the host phrase with its live timer', async () => {
    const host = addRunningHost()
    apply(ctx as never)

    const line = host.querySelector('[data-verdandi-running-line]')
    expect(line).not.toBeNull()
    const copy = line!.querySelector('[data-verdandi-running-copy]')
    const live = line!.querySelector('[data-verdandi-running-a11y]')
    // the host's phrase with the skin's leading words, and the host's own tail kept
    // verbatim so the live timer survives the replacement
    expect(copy?.textContent).toBe('薇儿烧烤中，用时 20 秒 ···')
    // the host's own string is what assistive tech hears, from our live region
    expect(live?.textContent).toBe('深度求索中')
    expect(live?.getAttribute('role')).toBe('status')
    expect(live?.getAttribute('aria-live')).toBe('polite')

    // The takeover marker has to survive the passes that our own writes trigger:
    // `clearOwnedHooks()` sweeps owned attributes on every sync.
    await settle()
    expect(host.hasAttribute('data-verdandi-running-bar')).toBe(true)
    expect(host.querySelector('[data-verdandi-running-line]')).not.toBeNull()

    // A characterData mutation is what the host's 1 Hz timer does.
    host.querySelector('.whatever_leafHostish')!.firstChild!.nodeValue = '深度求索中，用时 1 分 07 秒 ···'
    await settle()
    expect(host.querySelector('[data-verdandi-running-copy]')?.textContent).toBe('薇儿烧烤中，用时 1 分 07 秒 ···')

    ctx.disposeAll()
    expect(document.querySelector('[data-verdandi-running-line]')).toBeNull()
    expect(host.hasAttribute('data-verdandi-running-bar')).toBe(false)
    // the host's own line is back in charge, untouched
    expect(host.querySelector('.whatever_leafHostish')?.textContent).toBe('深度求索中，用时 1 分 07 秒 ···')
  })

  it('leaves a running line whose phrase it does not know completely alone', () => {
    const host = addRunningHost(`
      <div data-chat-running>
        <span role="status">어떤 언어</span>
        <span class="whatever_textHostish">어떤 언어，用时 20 秒</span>
      </div>`)
    apply(ctx as never)

    expect(host.hasAttribute('data-verdandi-running-bar')).toBe(false)
    expect(host.querySelector('[data-verdandi-running-line]')).toBeNull()
  })
})

describe('0.2.0 region resolution', () => {
  let ctx: MockContext
  beforeEach(() => {
    document.body.removeAttribute('data-dsh-verdandi')
    document.body.innerHTML = SHELL_2X
    ctx = new MockContext()
  })
  afterEach(() => ctx.disposeAll())

  it('derives boxed regions without data-pane and removes its stamps on dispose', () => {
    expect(document.querySelector('[data-pane]')).toBeNull()
    apply(ctx as never)

    expect(region('sidebar')).toBe(sidebarPane())
    expect(region('conversation')).toBe(conversationPane())
    expect(region('details')).toBe(document.querySelector('[data-sidebar-right-panel]'))
    for (const pane of document.querySelectorAll<HTMLElement>('[data-verdandi-pane]')) {
      expect(window.getComputedStyle(pane).display).not.toBe('contents')
    }

    const conversation = conversationPane()!
    expect(conversation.style.getPropertyValue('--vd-conversation-header-height')).not.toBe('')
    ctx.disposeAll()
    expect(document.querySelector('[data-verdandi-pane]')).toBeNull()
    expect(conversation.style.getPropertyValue('--vd-conversation-header-height')).toBe('')
    expect(conversation.style.getPropertyValue('--vd-character-floor')).toBe('')
  })

  it('skips display:contents candidates instead of stamping the slot anchors', () => {
    document.querySelector('#root')!.insertAdjacentHTML('afterbegin', `
      <div data-pane="sidebar" style="display:contents"></div>
      <div class="old_sidebarCol" style="display:contents"></div>
      <div data-pane="conversation" style="display:contents"></div>`)
    apply(ctx as never)

    expect(region('sidebar')).toBe(document.querySelector('.pI_x6G_sidebarCol'))
    expect(region('conversation')).toBe(document.querySelector('.wSkVaW_root'))
    expect(document.querySelector('[data-verdandi-pane][style*="contents"]')).toBeNull()
  })

  it('keeps a closed right panel free of details markers and decorations', () => {
    const panel = document.querySelector<HTMLElement>('[data-sidebar-right-panel]')!
    panel.removeAttribute('data-sidebar-right-open')
    apply(ctx as never)

    expect(region('details')).toBeNull()
    expect(panel.hasAttribute('data-verdandi-details-empty')).toBe(false)
    expect(panel.querySelector('[data-verdandi-decoration]')).toBeNull()
  })

  it('cleans and restores the mounted right panel as it opens and closes', async () => {
    const panel = document.querySelector<HTMLElement>('[data-sidebar-right-panel]')!
    panel.removeAttribute('data-sidebar-right-open')
    apply(ctx as never)
    expect(region('details')).toBeNull()

    panel.setAttribute('data-sidebar-right-open', 'true')
    await settle()
    expect(region('details')).toBe(panel)
    expect(panel.hasAttribute('data-verdandi-details-empty')).toBe(true)
    expect(panel.querySelectorAll("[data-verdandi-decoration='details-record']")).toHaveLength(1)

    panel.removeAttribute('data-sidebar-right-open')
    await settle()
    expect(region('details')).toBeNull()
    expect(panel.hasAttribute('data-verdandi-details-empty')).toBe(false)
    expect(panel.querySelector('[data-verdandi-decoration]')).toBeNull()

    panel.setAttribute('data-sidebar-right-open', 'true')
    await settle()
    expect(region('details')).toBe(panel)
    expect(panel.querySelectorAll("[data-verdandi-decoration='details-record']")).toHaveLength(1)
  })

  it('responds to aria-hidden and hidden changes on an open right panel', async () => {
    const panel = document.querySelector<HTMLElement>('[data-sidebar-right-panel]')!
    apply(ctx as never)

    panel.setAttribute('aria-hidden', 'true')
    await settle()
    expect(region('details')).toBeNull()
    expect(panel.querySelector('[data-verdandi-decoration]')).toBeNull()

    panel.setAttribute('aria-hidden', 'false')
    await settle()
    expect(region('details')).toBe(panel)

    panel.hidden = true
    await settle()
    expect(region('details')).toBeNull()
    panel.hidden = false
    await settle()
    expect(region('details')).toBe(panel)
  })

  it('releases the empty-state hook when Dockkit mounts content', async () => {
    const panel = document.querySelector<HTMLElement>('[data-sidebar-right-panel]')!
    apply(ctx as never)
    expect(panel.hasAttribute('data-verdandi-details-empty')).toBe(true)

    panel.querySelector('[data-dockkit-empty]')!.outerHTML = '<section data-dockkit-pane="pane1">工具详情</section>'
    await settle()
    expect(region('details')).toBe(panel)
    expect(panel.hasAttribute('data-verdandi-details-empty')).toBe(false)
  })

  it('reads the root phase and observes content-phase changes when the root omits it', async () => {
    const conversation = conversationPane()!
    const content = conversation.querySelector('[data-content-phase]')!
    conversation.setAttribute('data-phase', 'blank')
    apply(ctx as never)
    expect(conversation.getAttribute('data-verdandi-phase')).toBe('blank')
    expect(conversation.querySelector('[data-verdandi-stage]')?.getAttribute('data-verdandi-phase')).toBe('blank')

    conversation.removeAttribute('data-phase')
    content.setAttribute('data-content-phase', 'restoring')
    await settle()
    expect(conversation.getAttribute('data-verdandi-phase')).toBe('restoring')

    content.removeAttribute('data-content-phase')
    content.insertAdjacentHTML('beforeend', '<div data-phase="idle"></div>')
    await settle()
    expect(conversation.getAttribute('data-verdandi-phase')).toBe('idle')
  })

  it('resolves replacement DOM and releases detached regions before dispose', async () => {
    apply(ctx as never)
    const previous = ['sidebar', 'conversation', 'details'].map((name) => region(name)!)
    document.querySelector('#root')!.outerHTML = SHELL_2X
    await settle()

    for (const pane of previous) {
      expect(pane.hasAttribute('data-verdandi-pane')).toBe(false)
      expect(pane.hasAttribute('data-verdandi-phase')).toBe(false)
      expect(pane.querySelector('[data-verdandi-decoration], [data-verdandi-stage]')).toBeNull()
      expect(pane.querySelector('[data-verdandi-header], [data-verdandi-slip]')).toBeNull()
    }
    expect(region('conversation')).toBe(conversationPane())
    expect(region('details')).not.toBeNull()
    expect(document.querySelectorAll('[data-verdandi-stage]')).toHaveLength(1)

    ctx.disposeAll()
    expect(document.querySelector('[data-verdandi-pane], [data-verdandi-stage], [data-verdandi-decoration]')).toBeNull()
  })

  it('re-resolves host slots instead of keeping a stale skin stamp', async () => {
    const previous = conversationPane()!
    const slot = document.querySelector('[data-slot="main.conversation"]')!
    previous.insertAdjacentHTML('beforeend', '<div data-chat-running><span>深度求索中，用时 10 秒</span></div>')
    apply(ctx as never)
    const previousRunning = previous.querySelector('[data-chat-running]')!
    expect(previousRunning.hasAttribute('data-verdandi-running-bar')).toBe(true)

    slot.setAttribute('data-slot', 'retired')
    slot.insertAdjacentHTML('afterend', `
      <div data-slot="main.conversation" style="display:contents">
        <main id="replacement-conversation" data-phase="blank">
          <div data-slot="conversation.header" style="display:contents"><header></header></div>
          <div data-chat-running><span>深度求索中，用时 20 秒</span></div>
        </main>
      </div>`)
    await settle()

    const replacement = document.querySelector<HTMLElement>('#replacement-conversation')!
    expect(region('conversation')).toBe(replacement)
    expect(previous.hasAttribute('data-verdandi-pane')).toBe(false)
    expect(previous.querySelector('[data-verdandi-stage], [data-verdandi-decoration], [data-verdandi-header]')).toBeNull()
    expect(replacement.querySelector('header')?.hasAttribute('data-verdandi-header')).toBe(true)
    expect(previousRunning.hasAttribute('data-verdandi-running-bar')).toBe(false)
    expect(previousRunning.querySelector('[data-verdandi-running-line]')).toBeNull()
    const running = replacement.querySelector('[data-chat-running]')!
    expect(running.hasAttribute('data-verdandi-running-bar')).toBe(true)
    expect(running.querySelector('[data-verdandi-running-copy]')?.textContent).toBe('薇儿烧烤中，用时 20 秒')

    running.querySelector('span')!.firstChild!.nodeValue = '深度求索中，用时 21 秒'
    await settle()
    expect(running.querySelector('[data-verdandi-running-copy]')?.textContent).toBe('薇儿烧烤中，用时 21 秒')
    expect(previousRunning.querySelector('[data-verdandi-running-line]')).toBeNull()
  })
})
