# apiGen：简单的 REST API 生成器

**原版在线应用：** https://rezaghaeli.github.io/apiGen/

**中文版在线应用：** https://johnnylin707.github.io/apiGen-Chinese/

描述一个模型（名称和属性），apiGen 就会为它生成一个完整、可直接运行的 Node.js REST API 项目：**Express 5**、**MongoDB** 和 **Mongoose 9**。所有操作都在浏览器中完成，你输入的内容不会被发送到任何地方。

## 你会得到什么

一个文件夹（可下载为 `.zip`，也可逐个复制文件），包含：

| 文件 | 说明 |
|---|---|
| `server.js` | API 主体：Mongoose schema 和 model、五条 REST 路由、JSON 格式的 404 和错误处理，以及“先连接 MongoDB，再启动监听” |
| `.env` | 连接字符串和端口（由 `dotenv` 读取），密码不会写进代码 |
| `.env.example` | 使用占位符的相同配置，可安全分享 |
| `package.json` | 依赖（express、mongoose、dotenv、cors）以及 `npm start` / `npm run dev` 脚本 |
| `.gitignore` | 让 `node_modules/` 和 `.env` 不进入 Git |
| `README.md` | 运行说明、接口表格，以及每个接口的 curl 命令 |

以 `Book` 模型为例，生成的 API 为：

| 方法 | 路径 | 成功 | 错误 |
|---|---|---|---|
| GET | `/api/books` | 200 + 所有 book | |
| GET | `/api/books/:id` | 200 + 该 book | 404 未找到，400 id 无效 |
| POST | `/api/books` | 201 + 已保存的 book | 400 数据无效 |
| PUT | `/api/books/:id` | 200 + 更新后的 book（只发送需要修改的字段） | 404、400 |
| DELETE | `/api/books/:id` | 204 | 404、400 |

错误以 JSON 返回：`{ "error": { "message": "..." } }`。也可以使用“经典”路由风格（`/add`、`/update/:id`、`/delete/:id`）。

## 使用方法

1. 打开应用，输入**模型名称**（单数，例如 `Book`）。用于 URL 和集合名称的复数形式会自动填充。
2. 选择数据库：**MongoDB Atlas**（数据库用户、密码、集群地址、数据库名称）、**本地** MongoDB，或**粘贴连接字符串**。
3. 添加**属性**（名称、类型、是否必填）。
4. 点击**生成 API 项目**，然后点击**下载项目（.zip）**。
5. 解压后，在该文件夹中运行 `npm install` 和 `npm run dev`。需要 Node.js 20 或更高版本。
6. 测试：页面会按顺序列出 8 个请求（方法、URL、请求体、预期状态码）：创建、列表、获取、更新、错误数据、无效 id、删除，以及删除后获取。

## 中英文切换

页面右上角有「中文 / English」按钮，点击即可切换整页文案，包括表单、按钮、提示、校验错误，以及生成后的测试计划和示例卡片。语言选择会保存在浏览器的 `localStorage` 中，刷新页面后仍然有效。

生成的项目文件仍保持英文，以确保代码和依赖可直接运行。

## 本地运行生成器

用现代浏览器打开 `index.html`（保持 `apigen.js` 和 `api.css` 与其在同一目录），或用任意静态服务器托管该目录。`apigen.js` 中的 `ApiGen.build(spec)` 是纯函数，也可以在 Node 中使用：

```js
const ApiGen = require('./apigen.js');
```

## 2026 版本更新

- 生成的代码兼容当前依赖版本：旧的 `useNewUrlParser` / `useUnifiedTopology` 选项已被新版 MongoDB 驱动拒绝，因此已移除。
- 连接字符串写入 `.env`（密码经过 URL 编码），不再写入 `server.js`。
- 使用 REST 路径和标准状态码（201、204、404、400）；通过 `findByIdAndUpdate` 实现部分更新（`returnDocument: 'after'`、`runValidators: true`）；CastError 和 ValidationError 统一由 JSON 错误处理函数返回。
- 正确的复数形式（categories、people、statuses），同时用于 URL 和集合名称。
- 校验名称，确保生成的代码可以运行（不允许空格、关键字或内置名称）。
- 生成完整项目（package.json、.env、.gitignore、README），支持下载 `.zip`。
- 页面提供测试计划：按顺序列出 8 个请求及每个请求应返回的状态码。

---

## 支持与捐赠

如果你喜欢这个应用并享受使用，可以通过以下方式随意打赏：

- **PayPal**：[paypal.me/rezaghaeli](https://paypal.me/rezaghaeli)
- **Buy Me a Coffee**：[buymeacoffee.com/rezaghaeli](https://buymeacoffee.com/rezaghaeli)

你的支持鼓励我创作更多类似的实用应用！
