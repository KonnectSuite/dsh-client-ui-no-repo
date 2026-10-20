import { randomUUID } from '@deepseek-ai/dsh-util-crypto';
import { en, NS, zh } from "./locales.js";
import { childPath, isNoRepoCwd } from "./path.js";
/** Services this plugin waits for. The workspace browser owns the socket. */
export const inject = [
    'looseSessionGroups', 'uiWorkspace', 'sessions', 'workspaces', 'locale', 'remote',
];
/** Group account key. Also the expansion and pin-order key. */
const GROUP_ID = 'no-repo';
/**
 * Register the No Repo group and drop it when this plugin disposes.
 * @param ctx - client root context.
 */
export function apply(ctx) {
    const groups = ctx.get('looseSessionGroups');
    const locale = ctx.get('locale');
    ctx.effect(() => locale.register(NS, { zh, en }), 'ui-no-repo: dictionaries');
    ctx.effect(() => {
        const contribution = () => ({
            id: GROUP_ID,
            label: locale.bind(NS)('group.noRepo'),
            owns: (session) => isNoRepoCwd(session.cwd),
            start: () => {
                void startNoRepoChat(ctx).catch((reason) => {
                    console.warn('no repo session failed:', reason);
                });
            },
        });
        let remove = groups.add(contribution());
        const stop = locale.subscribe(() => {
            remove();
            remove = groups.add(contribution());
        });
        return () => {
            stop();
            remove();
        };
    }, 'ui-no-repo: group');
}
/**
 * Open the current blank No Repo chat, or create one under a private directory.
 * @param ctx - client root context.
 * @returns when the chat is open.
 */
async function startNoRepoChat(ctx) {
    const sessions = ctx.get('sessions');
    const workspaces = ctx.get('workspaces');
    const uiWorkspace = ctx.get('uiWorkspace');
    const archived = new Set(workspaces.list.getSnapshot().archivedSessionIds);
    const list = sessions.list.getSnapshot();
    for (const id of list.ids) {
        const summary = list.byId[id];
        if (summary === undefined || !summary.blank || !isNoRepoCwd(summary.cwd) || archived.has(id))
            continue;
        uiWorkspace.openSession(id);
        return;
    }
    const home = ctx.remote.$host.home;
    if (home === undefined || home === '')
        throw new Error('no repo chat needs the host home directory');
    const sessionId = `session-${randomUUID()}`;
    // The host half of this plugin creates this directory when the row loads.
    const cwd = childPath(childPath(home, '.arya'), '.arya-no-repo');
    await sessions.create({ sessionId, cwd });
    uiWorkspace.openSession(sessionId);
}
//# sourceMappingURL=index.js.map