/**
 * No Repo group. Registers one loose-session contribution above Ungrouped.
 * Unplugging this plugin removes the group and leaves those chats inert
 * until a workspace is chosen.
 */
import type { Context } from '@deepseek-ai/cordis';
/** Services this plugin waits for. The workspace browser owns the socket. */
export declare const inject: string[];
/**
 * Register the No Repo group and drop it when this plugin disposes.
 * @param ctx - client root context.
 */
export declare function apply(ctx: Context): void;
//# sourceMappingURL=index.d.ts.map