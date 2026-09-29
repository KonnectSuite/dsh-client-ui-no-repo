/** Path segment of the private directory a No Repo chat owns. */
export declare const NO_REPO_SEGMENT = ".arya-no-repo";
/**
 * Whether a Session cwd is a No Repo directory.
 * @param cwd - Session working directory, when the list has one.
 * @returns `true` when a path segment is {@link NO_REPO_SEGMENT}.
 */
export declare function isNoRepoCwd(cwd: string | undefined): boolean;
/**
 * Append one path segment, keeping the parent's separator.
 * @param parent - absolute directory.
 * @param name - single segment.
 * @returns the child path.
 */
export declare function childPath(parent: string, name: string): string;
//# sourceMappingURL=path.d.ts.map