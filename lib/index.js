import { mkdir } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
//#region lib/types/index.js
/**
* No Repo sidebar group, node half. Creates the private scratch directory
* this plugin's chats use. The browser half ships through `exports["./client"]`.
* Remove the patch row to drop the group and stop creating that directory.
*/
/** Path segment that marks a chat as No Repo. Matches the browser half. */
const NO_REPO_SEGMENT = ".arya-no-repo";
/**
* Make the shared No Repo directory under the host home.
* @param ctx - host context.
*/
function apply(ctx) {
	ctx.effect(() => {
		mkdir(join(homedir(), ".arya", NO_REPO_SEGMENT), { recursive: true }).catch((error) => {
			console.warn("no repo directory failed:", error);
		});
		return () => {};
	}, "ui-no-repo: directory");
}
//#endregion
export { apply };
