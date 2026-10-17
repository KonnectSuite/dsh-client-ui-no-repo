---
description: "Start a chat without choosing a repository. The sidebar groups these chats separately and reuses an existing blank chat before creating another. Chats use a private directory under the host home."
kind: "package-bundle"
---

# @deepseek-ai/dsh-client-ui-no-repo

English | [中文](README.zh.md)

<a id="summary"></a>
## Summary

Start a chat without choosing a repository. The sidebar groups these chats separately and reuses an existing blank chat before creating another. Chats use a private directory under the host home.

<a id="table-of-contents"></a>
## Table of Contents

- [Use this package](#use-this-package)
- [Understand the implementation](#understand-the-implementation)
- [Model Experience](#model-experience)
- [Known Limitations and Deferred Work](#known-limitations-and-deferred-work)
- [Dev Note](#dev-note)

<a id="use-this-package"></a>
## Use this package

Enable the shipped `ui-no-repo` profile row. Select No Repo in the sidebar to open a chat.

<a id="understand-the-implementation"></a>
## Understand the implementation

The host creates `.arya/.arya-no-repo`; the browser registers a locale-aware group and creates or opens its sessions. Contributions dispose with the plugin.

See [Host](src/index.ts) and [Client](src/client/index.ts).

<a id="model-experience"></a>
## Model Experience

### Session directory

#### What the model sees

The session uses `.arya-no-repo` as its working directory. Session context owns any model-visible directory information; this UI registers no tools or prompt sections.

#### Token effect

No additional prompt text is registered. Ordinary conversation and directory context have their normal costs.

#### KV Cache effect

Opening another session changes that session context; the group label does not enter provider requests.

## Known Limitations and Deferred Work

<a id="known-limitations-and-deferred-work"></a>

- The host home must be available; these chats are not attached to a repository checkout.

<a id="dev-note"></a>
### Dev Note

<details>
<summary>Maintainer context</summary>

None.

</details>

Optional Arya product bundles are selected in the profile and managed through Plugin Market. Disabling or removing a shipped bundle changes the profile selection; it does not erase installer-owned package files. The same pinned package remains available for restoration. Core runtime and plugin management services remain protected.
