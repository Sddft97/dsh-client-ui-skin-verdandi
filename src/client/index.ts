/**
 * Verdandi / White Vow presentation skin.
 *
 * The runtime owns only reversible data attributes, a decorative stage inside
 * the conversation pane, and layout measurements used by that stage. It does
 * not register services or participate in model requests.
 */
import type { Context } from '@deepseek-ai/cordis'
import {
  DETAILS_ART_DARK,
  DETAILS_ART_LIGHT,
  SWORD_CREST,
} from './art.js'
import {
  BRIDAL_FLORAL_CORNER,
  BRIDAL_VEIL_CORNER,
  CHILDHOOD_RECORD,
  HERO_CHIBI_LEFT,
  HERO_CHIBI_RIGHT,
  OFFICIAL_SACRED_TREE,
  Q_AVATAR,
  RING_TAG,
  SEQUENCE_SWORD,
  SIDEBAR_BRIDAL_CG,
  STAGE_FIGURE_LEFT,
  STAGE_FIGURE_RIGHT,
  VOW_AVATAR_FRAME,
  VOW_FOLDER_ICON,
  VOW_NAMECARD,
  VOW_RINGS,
  WEDDING_AVATAR,
  WORKSPACE_SCENE_DARK,
  WORKSPACE_SCENE_LIGHT,
} from './stage-art.generated.js'
import {
  COMPOSER_LACE,
  HEADER_VEIL,
  INVITATION_LACE,
  SIDEBAR_FRAME,
  VOW_SEAL,
} from './ornaments.js'
import css from './verdandi.module.css'

const SKIN_ATTR = 'data-dsh-verdandi'
const WORKSPACE_ATTR = 'data-verdandi-workspace'
const MODAL_ATTR = 'data-verdandi-modal-open'
const SIDEBAR_SIZE_ATTR = 'data-verdandi-sidebar-size'
const CONVERSATION_PHASE_ATTR = 'data-verdandi-phase'
const CONVERSATION_VIEW_ATTR = 'data-verdandi-view'
const DETAILS_EMPTY_ATTR = 'data-verdandi-details-empty'
const SLIP_ATTR = 'data-verdandi-slip'
const RUNNING_ATTR = 'data-verdandi-running'
const STAGE_SELECTOR = '[data-verdandi-stage]'
const DECORATION_SELECTOR = '[data-verdandi-decoration]'
const LEGACY_SELECTOR = '[data-verdandi-sidebar-card], [data-verdandi-wedding], [data-verdandi-chrome]'
const THEME_SOURCE = '@hjbztlbr/dsh-client-ui-skin-verdandi'
const OWNED_HOOKS = [
  'data-verdandi-header',
  'data-verdandi-new-session',
  'data-verdandi-nav-entry',
  'data-verdandi-sidebar-action',
  RUNNING_ATTR,
  DETAILS_EMPTY_ATTR,
] as const

/**
 * Markers for transcript rows the host renders as bare metadata over the scenic
 * workspace. `data-system-prompt-body` is the only one without a CSS-stable
 * ancestor hook, so it is resolved through the node seat below.
 */
const SLIP_MARKER_SELECTOR = "[data-system-prompt-body]"

type ThemeTokenPair = {
  light: string
  dark: string
}

type ThemeRuntimeLike = {
  overrideTokens(source: string, tokens: Record<string, ThemeTokenPair>): () => void
}

const THEME_TOKENS: Record<string, ThemeTokenPair> = {
  '--dsw-alias-brand-primary': { light: '#8e2438', dark: '#e4cfa0' },
  '--dsw-alias-button-primary-fill': { light: '#8e2438', dark: '#e4cfa0' },
  '--dsw-alias-button-primary-fill-active': { light: '#651a2b', dark: '#c6a767' },
  '--dsw-alias-button-primary-fill-hover': { light: '#752033', dark: '#f0ddb1' },
  '--dsw-alias-label-primary-inverted': { light: '#fffdfb', dark: '#25151b' },
}

const ASSET_PROPERTIES = {
  '--vd-art-sidebar-bridal': SIDEBAR_BRIDAL_CG,
  '--vd-art-workspace-light': WORKSPACE_SCENE_LIGHT,
  '--vd-art-workspace-dark': WORKSPACE_SCENE_DARK,
  '--vd-art-sword-crest': SWORD_CREST,
  '--vd-art-header-veil': HEADER_VEIL,
  '--vd-art-sidebar-frame': SIDEBAR_FRAME,
  '--vd-art-invitation-lace': INVITATION_LACE,
  '--vd-art-vow-seal': VOW_SEAL,
  '--vd-art-composer-lace': COMPOSER_LACE,
  '--vd-art-character-left': STAGE_FIGURE_LEFT,
  '--vd-art-character-right': STAGE_FIGURE_RIGHT,
  '--vd-art-official-sacred-tree': OFFICIAL_SACRED_TREE,
  '--vd-art-vow-avatar-frame': VOW_AVATAR_FRAME,
  '--vd-art-wedding-avatar': WEDDING_AVATAR,
  '--vd-art-vow-rings': VOW_RINGS,
  '--vd-art-ring-tag': RING_TAG,
  '--vd-art-vow-namecard': VOW_NAMECARD,
  '--vd-art-hero-chibi-left': HERO_CHIBI_LEFT,
  '--vd-art-hero-chibi-right': HERO_CHIBI_RIGHT,
  '--vd-art-childhood-record': CHILDHOOD_RECORD,
  '--vd-art-sequence-sword': SEQUENCE_SWORD,
  '--vd-art-q-avatar': Q_AVATAR,
  '--vd-art-bridal-floral-corner': BRIDAL_FLORAL_CORNER,
  '--vd-art-bridal-veil-corner': BRIDAL_VEIL_CORNER,
  '--vd-art-vow-folder': VOW_FOLDER_ICON,
  '--vd-art-details-light': DETAILS_ART_LIGHT,
  '--vd-art-details-dark': DETAILS_ART_DARK,
} as const

const layoutProperties = [
  '--vd-character-floor',
  '--vd-conversation-header-height',
] as const

function firstElement<T extends HTMLElement>(selector: string): T | null {
  return document.querySelector<T>(selector)
}

function isRendered(element: HTMLElement | null): element is HTMLElement {
  if (!element || element.hidden || element.getAttribute('aria-hidden') === 'true') return false
  const style = window.getComputedStyle(element)
  return style.display !== 'none' && style.visibility !== 'hidden'
}

function removeLegacyNodes(): void {
  for (const node of document.querySelectorAll<HTMLElement>(LEGACY_SELECTOR)) node.remove()
}

function ensureDecoration(parent: HTMLElement | null, part: string): HTMLElement | null {
  if (!parent) return null
  let decoration = parent.querySelector<HTMLElement>(`:scope > [data-verdandi-decoration='${part}']`)
  if (decoration) return decoration

  decoration = document.createElement('div')
  decoration.dataset.verdandiDecoration = part
  decoration.setAttribute('aria-hidden', 'true')
  parent.append(decoration)
  return decoration
}

function ensureWeddingDecorations(
  sidebar: HTMLElement | null,
  conversation: HTMLElement | null,
  details: HTMLElement | null,
): void {
  const sidebarRoot = sidebar?.querySelector<HTMLElement>("[data-slot='sidebar']") ?? sidebar
  ensureDecoration(sidebarRoot, 'sidebar-portrait')
  ensureDecoration(sidebarRoot, 'sidebar-sacred-tree')
  ensureDecoration(sidebarRoot, 'sidebar-rail-avatar')
  ensureDecoration(sidebarRoot, 'sidebar-veil-corners-top')
  ensureDecoration(sidebarRoot, 'sidebar-veil-corners-bottom')
  ensureDecoration(conversation, 'workspace-lace')
  const header = conversation?.querySelector<HTMLElement>("[data-slot='conversation.session.header'] > header") ?? null
  ensureDecoration(header, 'header-veil')
  ensureDecoration(header, 'header-namecard')
  ensureDecoration(header, 'header-bridal-corners')
  ensureDecoration(header, 'header-veil-corners')
  ensureDecoration(header, 'header-vow-crest')

  const composer = conversation?.querySelector<HTMLElement>('[data-composer-card]') ?? null
  ensureDecoration(composer, 'composer-seal')
  ensureDecoration(composer, 'composer-bridal-corners')
  ensureDecoration(composer, 'composer-veil-inner')
  ensureDecoration(composer, 'hero-chibi-left')
  ensureDecoration(composer, 'hero-chibi-right')
  ensureDecoration(details, 'details-record')

  for (const markdown of conversation?.querySelectorAll<HTMLElement>(
    "[data-chat-flow-kind='assistant-step'] [data-slot='conversation.chat.node'] [class*='_markdown_']",
  ) ?? []) {
    ensureDecoration(markdown, 'assistant-avatar')
  }
}

function ensureCharacterStage(conversation: HTMLElement): HTMLElement {
  let stage = conversation.querySelector<HTMLElement>(`:scope > ${STAGE_SELECTOR}`)
  if (
    stage
    && stage.querySelector("[data-verdandi-figure='left']")
    && stage.querySelector("[data-verdandi-figure='right']")
  ) {
    return stage
  }

  stage?.remove()

  for (const stale of document.querySelectorAll<HTMLElement>(STAGE_SELECTOR)) stale.remove()

  stage = document.createElement('div')
  stage.dataset.verdandiStage = ''
  stage.className = css.characterStage ?? 'verdandiCharacterStage'
  stage.setAttribute('aria-hidden', 'true')

  const leftFigure = document.createElement('div')
  leftFigure.dataset.verdandiFigure = 'left'
  leftFigure.className = `${css.characterFigure ?? 'verdandiCharacterFigure'} ${css.figureLeft ?? 'verdandiFigureLeft'}`

  const rightFigure = document.createElement('div')
  rightFigure.dataset.verdandiFigure = 'right'
  rightFigure.className = `${css.characterFigure ?? 'verdandiCharacterFigure'} ${css.figureRight ?? 'verdandiFigureRight'}`

  stage.append(leftFigure, rightFigure)
  conversation.prepend(stage)
  return stage
}

function clearOwnedHooks(): void {
  for (const attribute of OWNED_HOOKS) {
    for (const element of document.querySelectorAll<HTMLElement>(`[${attribute}]`)) {
      element.removeAttribute(attribute)
    }
  }
}

/**
 * Resolve the row element that should carry a slip for `marker`.
 *
 * The host wraps every chat node in a stable seat, and the seat is the
 * innermost element guaranteed to contain the marker, so the slip never spans
 * more than one row. `data-slot` is preferred over `data-chat-flow-key`
 * because the seat is nested inside the flow item.
 * @param marker - Element that identifies the row, e.g. a system-prompt body.
 * @returns The nearest containing row element, or null outside the chat seat.
 */
function slipRowFor(marker: HTMLElement): HTMLElement | null {
  const seat = marker.closest<HTMLElement>("[data-slot='conversation.chat.node']")
  if (seat) {
    const root = seat.firstElementChild
    if (root instanceof HTMLElement && root.contains(marker)) return root
    return seat
  }
  return marker.closest<HTMLElement>('[data-chat-flow-key]')
}

/**
 * Tag the transcript rows that have no CSS-stable hook with the slip attribute.
 * Rows the stylesheet can target directly (turn error, compaction, process,
 * tail) are left untouched, so only this marker list needs runtime work.
 * @param conversation - Visible conversation pane, or null when unrendered.
 */
function decorateLegibilityRows(conversation: HTMLElement | null): void {
  const rows = new Set<HTMLElement>()
  for (const marker of conversation?.querySelectorAll<HTMLElement>(SLIP_MARKER_SELECTOR) ?? []) {
    const row = slipRowFor(marker)
    if (row) rows.add(row)
  }

  for (const tagged of conversation?.querySelectorAll<HTMLElement>(`[${SLIP_ATTR}]`) ?? []) {
    if (!rows.has(tagged)) tagged.removeAttribute(SLIP_ATTR)
  }
  for (const row of rows) {
    if (row.getAttribute(SLIP_ATTR) !== 'context') row.setAttribute(SLIP_ATTR, 'context')
  }
}

function decorateStableRegions(): void {
  clearOwnedHooks()

  const header = firstElement<HTMLElement>("[data-slot='conversation.session.header'] > header")
  header?.setAttribute('data-verdandi-header', '')

  const details = firstElement<HTMLElement>("[data-pane='details']")
  const detailsText = (details?.textContent ?? '').replace(/\s+/g, ' ').trim()
  if (/点击消息流中的工具行查看详情|select.+tool.+row.+details/i.test(detailsText)) {
    details?.setAttribute(DETAILS_EMPTY_ATTR, '')
  }

  const sidebar = firstElement<HTMLElement>("[data-pane='sidebar']")
  if (!sidebar) return

  for (const button of sidebar.querySelectorAll<HTMLButtonElement>('button')) {
    const label = `${button.getAttribute('aria-label') ?? ''} ${button.textContent ?? ''}`.trim()
    const text = (button.textContent ?? '').trim()

    // dsh 0.1.7 wraps the label in `newSessionLabel` / `newSessionContent` and
    // appends a shortcut hint, so the button text is no longer the bare label.
    // Match the stable class suffix first and keep the text rule for older shells.
    if (/newSession/i.test(button.className) || /^(新会话|New session)$/i.test(text)) {
      button.dataset.verdandiNewSession = ''
    }
    if (/^(任务看板|Task board|SSH|技能中心|Skill center)$/i.test(text)) button.dataset.verdandiNavEntry = ''
    if (/搜索会话|Search sessions|视图选项|View options|添加工作区|Add workspace/i.test(label)) {
      button.dataset.verdandiSidebarAction = ''
    }
  }
}

/**
 * Mark the turn-process control while its turn is actually running.
 *
 * dsh 0.1.7 moved the live status into that control and switches its label copy
 * with the turn state (running / worked / took / failed), so the skin's copy
 * swap has to be scoped by state instead of by the removed `_turnStatus` class.
 * Only the running label is marked, so the finished states keep the host wording.
 * @param conversation - Visible conversation pane, or null when unrendered.
 */
function markRunningStatus(conversation: HTMLElement | null): void {
  const running = conversation
    ? [...conversation.querySelectorAll<HTMLElement>('[data-turn-process]')].filter((node) => {
      const text = (node.querySelector("[class*='_label']")?.textContent ?? '').trim()
      return /^(深度求索中|Deep diving)/i.test(text)
    })
    : []

  for (const marked of document.querySelectorAll<HTMLElement>(`[${RUNNING_ATTR}]`)) {
    if (!running.includes(marked)) marked.removeAttribute(RUNNING_ATTR)
  }
  for (const node of running) node.setAttribute(RUNNING_ATTR, '')
}

function setSidebarSize(body: HTMLElement, sidebar: HTMLElement | null): void {
  const width = sidebar?.getBoundingClientRect().width || sidebar?.offsetWidth || 0
  if (width > 0 && width < 96) body.setAttribute(SIDEBAR_SIZE_ATTR, 'rail')
  else if (width > 0 && width < 260) body.setAttribute(SIDEBAR_SIZE_ATTR, 'narrow')
  else body.setAttribute(SIDEBAR_SIZE_ATTR, 'wide')
}

function measureConversation(conversation: HTMLElement): void {
  const conversationRect = conversation.getBoundingClientRect()
  const header = conversation.querySelector<HTMLElement>("[data-slot='conversation.session.header'] > header")
  const composer = conversation.querySelector<HTMLElement>(
    "[data-composer-seat], [data-slot='conversation.input.dock'], [data-slot='conversation.composer']",
  )

  const headerRect = header?.getBoundingClientRect()
  const composerRect = composer?.getBoundingClientRect()
  const headerHeight = headerRect && headerRect.height > 0
    ? Math.max(0, headerRect.bottom - conversationRect.top)
    : 76
  const floor = composerRect && composerRect.height > 0
    ? Math.max(18, conversationRect.bottom - composerRect.top + 8)
    : 154

  conversation.style.setProperty('--vd-conversation-header-height', `${Math.round(headerHeight)}px`)
  conversation.style.setProperty('--vd-character-floor', `${Math.round(floor)}px`)
}

function setStageWidth(stage: HTMLElement, conversation: HTMLElement): void {
  const width = conversation.getBoundingClientRect().width || conversation.offsetWidth || 0
  stage.dataset.verdandiWidth = width >= 1360 ? 'wide' : width >= 840 ? 'medium' : 'compact'
  // The host's alternate work surfaces apply an important aria-hidden rule to
  // decorative children. This is our own node, so an owned inline declaration
  // is the narrowest reliable way to keep it visible on usable widths.
  stage.style.setProperty('display', width >= 840 ? 'block' : 'none', 'important')
}

function setConversationView(conversation: HTMLElement): 'chat' | 'trace' {
  const selectedTab = conversation.querySelector<HTMLElement>(
    "[data-slot='conversation.session.header'] [role='tab'][aria-selected='true']",
  )
  const label = (selectedTab?.textContent ?? '').trim()
  const view = /^(轨迹|Trace)$/i.test(label) ? 'trace' : 'chat'
  conversation.setAttribute(CONVERSATION_VIEW_ATTR, view)
  return view
}

function restoreAttribute(element: HTMLElement, name: string, previous: string | null): void {
  if (previous === null) element.removeAttribute(name)
  else element.setAttribute(name, previous)
}

export function apply(ctx: Context): void {
  const body = document.body
  const theme = ctx.get('theme') as ThemeRuntimeLike | undefined
  if (typeof theme?.overrideTokens === 'function') {
    ctx.effect(
      () => theme.overrideTokens(THEME_SOURCE, THEME_TOKENS),
      'ui-skin-verdandi: official theme token layer',
    )
  }
  const previousAttributes = new Map<string, string | null>([
    [SKIN_ATTR, body.getAttribute(SKIN_ATTR)],
    [WORKSPACE_ATTR, body.getAttribute(WORKSPACE_ATTR)],
    [MODAL_ATTR, body.getAttribute(MODAL_ATTR)],
    [SIDEBAR_SIZE_ATTR, body.getAttribute(SIDEBAR_SIZE_ATTR)],
  ])
  const previousAssetProperties = new Map<string, { value: string; priority: string }>()

  for (const [property, asset] of Object.entries(ASSET_PROPERTIES)) {
    previousAssetProperties.set(property, {
      value: body.style.getPropertyValue(property),
      priority: body.style.getPropertyPriority(property),
    })
    body.style.setProperty(property, `url(${JSON.stringify(asset)})`)
  }
  body.setAttribute(SKIN_ATTR, '')
  removeLegacyNodes()

  let resizeObserver: ResizeObserver | null = null
  let observed = new Set<Element>()
  let animationFrame = 0
  const requestFrame = typeof window.requestAnimationFrame === 'function'
    ? window.requestAnimationFrame.bind(window)
    : (callback: FrameRequestCallback) => window.setTimeout(() => callback(Date.now()), 0)
  const cancelFrame = typeof window.cancelAnimationFrame === 'function'
    ? window.cancelAnimationFrame.bind(window)
    : window.clearTimeout.bind(window)

  const syncResizeTargets = (targets: Array<HTMLElement | null>) => {
    if (!resizeObserver) return
    const next = new Set<Element>(targets.filter((target): target is HTMLElement => Boolean(target)))
    next.add(body)
    for (const element of observed) if (!next.has(element)) resizeObserver.unobserve(element)
    for (const element of next) if (!observed.has(element)) resizeObserver.observe(element)
    observed = next
  }

  const sync = () => {
    animationFrame = 0
    removeLegacyNodes()
    decorateStableRegions()

    const sidebar = firstElement<HTMLElement>("[data-pane='sidebar']")
    const conversation = firstElement<HTMLElement>("[data-pane='conversation']")
    const details = firstElement<HTMLElement>("[data-pane='details']")
    const workspaceVisible = isRendered(conversation)

    body.toggleAttribute(WORKSPACE_ATTR, workspaceVisible)
    body.toggleAttribute(MODAL_ATTR, Boolean(document.querySelector("[role='dialog'][aria-modal='true']")))
    setSidebarSize(body, sidebar)
    ensureWeddingDecorations(sidebar, workspaceVisible ? conversation : null, details)
    decorateLegibilityRows(workspaceVisible ? conversation : null)
    markRunningStatus(workspaceVisible ? conversation : null)

    if (workspaceVisible) {
      const stage = ensureCharacterStage(conversation)
      const phase = conversation.querySelector<HTMLElement>('[data-phase]')?.getAttribute('data-phase') ?? 'active'
      setConversationView(conversation)
      stage.dataset.verdandiPhase = phase
      conversation.setAttribute(CONVERSATION_PHASE_ATTR, phase)
      measureConversation(conversation)
      setStageWidth(stage, conversation)
    } else {
      for (const stage of document.querySelectorAll<HTMLElement>(STAGE_SELECTOR)) stage.remove()
      for (const pane of document.querySelectorAll<HTMLElement>("[data-pane='conversation']")) {
        pane.removeAttribute(CONVERSATION_PHASE_ATTR)
        pane.removeAttribute(CONVERSATION_VIEW_ATTR)
      }
    }

    syncResizeTargets([
      sidebar,
      conversation,
      details,
      conversation?.querySelector<HTMLElement>("[data-slot='conversation.session.header'] > header") ?? null,
      conversation?.querySelector<HTMLElement>("[data-composer-seat], [data-slot='conversation.input.dock']") ?? null,
    ])
  }

  const scheduleSync = () => {
    if (animationFrame) return
    animationFrame = requestFrame(sync)
  }

  resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(scheduleSync)
  const mutationObserver = new MutationObserver(scheduleSync)
  mutationObserver.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['aria-expanded', 'aria-selected', 'data-phase', 'hidden'],
  })
  window.addEventListener('resize', scheduleSync)
  window.visualViewport?.addEventListener('resize', scheduleSync)
  sync()

  ctx.effect(() => () => {
    mutationObserver.disconnect()
    resizeObserver?.disconnect()
    if (animationFrame) cancelFrame(animationFrame)
    window.removeEventListener('resize', scheduleSync)
    window.visualViewport?.removeEventListener('resize', scheduleSync)

    clearOwnedHooks()
    for (const decoration of document.querySelectorAll<HTMLElement>(DECORATION_SELECTOR)) decoration.remove()
    for (const slip of document.querySelectorAll<HTMLElement>(`[${SLIP_ATTR}]`)) slip.removeAttribute(SLIP_ATTR)
    for (const stage of document.querySelectorAll<HTMLElement>(STAGE_SELECTOR)) stage.remove()
    for (const conversation of document.querySelectorAll<HTMLElement>("[data-pane='conversation']")) {
      for (const property of layoutProperties) conversation.style.removeProperty(property)
      conversation.removeAttribute(CONVERSATION_PHASE_ATTR)
      conversation.removeAttribute(CONVERSATION_VIEW_ATTR)
    }

    for (const [property, previous] of previousAssetProperties) {
      if (previous.value) body.style.setProperty(property, previous.value, previous.priority)
      else body.style.removeProperty(property)
    }
    for (const [attribute, previous] of previousAttributes) restoreAttribute(body, attribute, previous)
  }, 'ui-skin-verdandi: white-vow presentation')
}
