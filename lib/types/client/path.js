/** Path segment of the private directory a No Repo chat owns. */
export const NO_REPO_SEGMENT = '.arya-no-repo';
/**
 * Whether a Session cwd is a No Repo directory.
 * @param cwd - Session working directory, when the list has one.
 * @returns `true` when a path segment is {@link NO_REPO_SEGMENT}.
 */
export function isNoRepoCwd(cwd) {
    if (cwd === undefined || cwd === '')
        return false;
    return cwd.replace(/\\/g, '/').split('/').includes(NO_REPO_SEGMENT);
}
/**
 * Append one path segment, keeping the parent's separator.
 * @param parent - absolute directory.
 * @param name - single segment.
 * @returns the child path.
 */
export function childPath(parent, name) {
    const sep = parent.includes('\\') && !parent.includes('/') ? '\\' : '/';
    return `${parent.replace(/[/\\]+$/, '')}${sep}${name}`;
}
//# sourceMappingURL=path.js.map