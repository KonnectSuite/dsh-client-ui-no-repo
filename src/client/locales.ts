/** `noRepo` namespace dictionaries. */

/** Dictionary namespace owned by this plugin. */
export const NS = 'noRepo'

/** Simplified Chinese dictionary (the key-set source of truth). */
export const zh = {
  'group.noRepo': '无仓库',
} satisfies Record<string, string>

/** The no-repo namespace key union. */
export type NoRepoKey = keyof typeof zh

/** English dictionary, checked complete against the zh key set. */
export const en = {
  'group.noRepo': 'No Repo',
} satisfies Record<NoRepoKey, string>
