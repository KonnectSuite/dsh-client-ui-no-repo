/**
 * No Repo group. Registers one loose-session contribution above Ungrouped.
 * Unplugging this plugin removes the group and leaves those chats inert
 * until a workspace is chosen.
 */
import type { Context } from '@deepseek-ai/cordis'
import { randomUUID } from '@deepseek-ai/dsh-util-crypto'
import type {} from '@deepseek-ai/dsh-api-remotes/client'
import type { ISessions } from '@deepseek-ai/dsh-api-session-controller/client'
import type { IWorkspaces } from '@deepseek-ai/dsh-api-workspace-controller/client'
import type { UiWorkspace } from '@deepseek-ai/dsh-client-ui-workspace/client'

interface LooseSessionGroups {
  add(group: {
    readonly id: string
    readonly label: string
    owns(session: { readonly cwd?: string }): boolean
    start(): void
  }): () => void
}
import type { SessionId } from '@deepseek-ai/dsh-session/types'
import { en, NS, zh } from './locales.ts'
import { childPath, isNoRepoCwd } from './path.ts'

/** Services this plugin waits for. The workspace browser owns the socket. */
export const inject = [
  'looseSessionGroups', 'uiWorkspace', 'sessions', 'workspaces', 'locale', 'remote',
]

/** Group account key. Also the expansion and pin-order key. */
const GROUP_ID = 'no-repo'

/**
 * Register the No Repo group and drop it when this plugin disposes.
 * @param ctx - client root context.
 */
export function apply(ctx: Context): void {
  const groups = ctx.get('looseSessionGroups') as LooseSessionGroups
  const locale = ctx.get('locale') as {
    register: (ns: string, dictionaries: { zh: typeof zh; en: typeof en }) => () => void
    bind: (ns: string) => (key: string) => string
    subscribe: (listener: () => void) => () => void
  }
  ctx.effect(() => locale.register(NS, { zh, en }), 'ui-no-repo: dictionaries')
  ctx.effect(() => {
    const contribution = () => ({
      id: GROUP_ID,
      label: locale.bind(NS)('group.noRepo'),
      owns: (session: { readonly cwd?: string }) => isNoRepoCwd(session.cwd),
      start: () => {
        void startNoRepoChat(ctx).catch((reason: unknown) => {
          console.warn('no repo session failed:', reason)
        })
      },
    })
    let remove = groups.add(contribution())
    const stop = locale.subscribe(() => {
      remove()
      remove = groups.add(contribution())
    })
    return () => {
      stop()
      remove()
    }
  }, 'ui-no-repo: group')
}

/**
 * Open the current blank No Repo chat, or create one under a private directory.
 * @param ctx - client root context.
 * @returns when the chat is open.
 */
async function startNoRepoChat(ctx: Context): Promise<void> {
  const sessions = ctx.get('sessions') as ISessions
  const workspaces = ctx.get('workspaces') as IWorkspaces
  const uiWorkspace = ctx.get('uiWorkspace') as UiWorkspace
  const archived = new Set(workspaces.list.getSnapshot().archivedSessionIds)
  const list = sessions.list.getSnapshot()
  for (const id of list.ids) {
    const summary = list.byId[id]
    if (summary === undefined || !summary.blank || !isNoRepoCwd(summary.cwd) || archived.has(id)) continue
    uiWorkspace.openSession(id)
    return
  }
  const home = ctx.remote.$host.home
  if (home === undefined || home === '') throw new Error('no repo chat needs the host home directory')
  const sessionId = `session-${randomUUID()}` as SessionId
  // The host half of this plugin creates this directory when the row loads.
  const cwd = childPath(childPath(home, '.arya'), '.arya-no-repo')
  await sessions.create({ sessionId, cwd })
  uiWorkspace.openSession(sessionId)
}
