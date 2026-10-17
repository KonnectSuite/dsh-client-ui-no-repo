---
description: "无需选择仓库即可开始聊天。侧边栏单独分组这些聊天，并在创建新聊天之前复用已有的空白聊天。聊天使用主机用户目录下的私有目录。"
kind: "package-bundle"
---

# @deepseek-ai/dsh-client-ui-no-repo

[English](README.md) | 中文

<a id="summary"></a>
## 概述

无需选择仓库即可开始聊天。侧边栏单独分组这些聊天，并在创建新聊天之前复用已有的空白聊天。聊天使用主机用户目录下的私有目录。

<a id="table-of-contents"></a>
## 目录

- [Use this package](#use-this-package)
- [Understand the implementation](#understand-the-implementation)
- [Model Experience](#model-experience)
- [Known Limitations and Deferred Work](#known-limitations-and-deferred-work)
- [Dev Note](#dev-note)

<a id="use-this-package"></a>
## 使用本包

启用随发行版提供的 `ui-no-repo` 配置条目。在侧边栏选择 No Repo 打开聊天。

<a id="understand-the-implementation"></a>
## 理解实现

主机创建 `.arya/.arya-no-repo`；浏览器注册支持本地化的分组，并创建或打开其中的会话。插件销毁时移除贡献。

参见 [Host](src/index.ts) 和 [Client](src/client/index.ts).

<a id="model-experience"></a>
## 模型体验

### Session directory

#### What the model sees

会话使用 `.arya-no-repo` 作为工作目录。会话上下文负责模型可见的目录信息；此界面不注册工具或提示词章节。

#### Token effect

不注册额外提示词。普通对话和目录上下文仍有各自的 token 成本。

#### KV Cache effect

打开其他会话会改变会话上下文；分组标签不进入提供商请求。

## 已知限制与延期工作

<a id="known-limitations-and-deferred-work"></a>

- 必须能访问主机用户目录；这些聊天不关联仓库检出目录。

<a id="dev-note"></a>
### 开发备注

<details>
<summary>维护者上下文</summary>

无。

</details>

可选 Arya 产品 bundle 由 profile 选择并通过插件市场管理。禁用或移除随安装包提供的 bundle 会改变 profile 选择，不会删除安装包拥有的文件；同一固定版本仍可恢复。核心运行时与插件管理服务仍受保护。
