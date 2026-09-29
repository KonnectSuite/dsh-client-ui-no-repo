window.__ModuleLoader__.load({
	id: "@deepseek-ai/dsh-client-ui-no-repo",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		//#region ../../util/crypto/src/index.ts
		/**
		* Random v4 UUID, minted from `crypto.getRandomValues`.
		* @returns the UUID string.
		*/
		function randomUUID() {
			const bytes = globalThis.crypto.getRandomValues(new Uint8Array(16));
			const hex = Array.from(bytes, (byte, index) => {
				return (index === 6 ? byte & 15 | 64 : index === 8 ? byte & 63 | 128 : byte).toString(16).padStart(2, "0");
			}).join("");
			return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
		}
		//#endregion
		//#region lib/types/client/locales.js
		/** `noRepo` namespace dictionaries. */
		/** Dictionary namespace owned by this plugin. */
		const NS = "noRepo";
		/** Simplified Chinese dictionary (the key-set source of truth). */
		const zh = { "group.noRepo": "无仓库" };
		/** English dictionary, checked complete against the zh key set. */
		const en = { "group.noRepo": "No Repo" };
		//#endregion
		//#region lib/types/client/path.js
		/** Path segment of the private directory a No Repo chat owns. */
		const NO_REPO_SEGMENT = ".arya-no-repo";
		/**
		* Whether a Session cwd is a No Repo directory.
		* @param cwd - Session working directory, when the list has one.
		* @returns `true` when a path segment is {@link NO_REPO_SEGMENT}.
		*/
		function isNoRepoCwd(cwd) {
			if (cwd === void 0 || cwd === "") return false;
			return cwd.replace(/\\/g, "/").split("/").includes(NO_REPO_SEGMENT);
		}
		/**
		* Append one path segment, keeping the parent's separator.
		* @param parent - absolute directory.
		* @param name - single segment.
		* @returns the child path.
		*/
		function childPath(parent, name) {
			const sep = parent.includes("\\") && !parent.includes("/") ? "\\" : "/";
			return `${parent.replace(/[/\\]+$/, "")}${sep}${name}`;
		}
		//#endregion
		//#region lib/types/client/index.js
		/** Services this plugin waits for. The workspace browser owns the socket. */
		const inject = [
			"looseSessionGroups",
			"uiWorkspace",
			"sessions",
			"workspaces",
			"locale",
			"remote"
		];
		/** Group account key. Also the expansion and pin-order key. */
		const GROUP_ID = "no-repo";
		/**
		* Register the No Repo group and drop it when this plugin disposes.
		* @param ctx - client root context.
		*/
		function apply(ctx) {
			const groups = ctx.get("looseSessionGroups");
			const locale = ctx.get("locale");
			ctx.effect(() => locale.register(NS, {
				zh,
				en
			}), "ui-no-repo: dictionaries");
			ctx.effect(() => {
				const contribution = () => ({
					id: GROUP_ID,
					label: locale.bind(NS)("group.noRepo"),
					owns: (session) => isNoRepoCwd(session.cwd),
					start: () => {
						startNoRepoChat(ctx).catch((reason) => {
							console.warn("no repo session failed:", reason);
						});
					}
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
			}, "ui-no-repo: group");
		}
		/**
		* Open the current blank No Repo chat, or create one under a private directory.
		* @param ctx - client root context.
		* @returns when the chat is open.
		*/
		async function startNoRepoChat(ctx) {
			const sessions = ctx.get("sessions");
			const workspaces = ctx.get("workspaces");
			const uiWorkspace = ctx.get("uiWorkspace");
			const archived = new Set(workspaces.list.getSnapshot().archivedSessionIds);
			const list = sessions.list.getSnapshot();
			for (const id of list.ids) {
				const summary = list.byId[id];
				if (summary === void 0 || !summary.blank || !isNoRepoCwd(summary.cwd) || archived.has(id)) continue;
				uiWorkspace.openSession(id);
				return;
			}
			const home = ctx.remote.$host.home;
			if (home === void 0 || home === "") throw new Error("no repo chat needs the host home directory");
			const sessionId = `session-${randomUUID()}`;
			const cwd = childPath(childPath(home, ".arya"), ".arya-no-repo");
			await sessions.create({
				sessionId,
				cwd
			});
			uiWorkspace.openSession(sessionId);
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map