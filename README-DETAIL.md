# product-api 详细操作指南

本文是 [README.md](README.md) 的详细补充，用一个完整的例子说明：如何在网页应用里填写一个 `Product` 模型，生成项目，下载 `product-api.zip`，解压到本地并运行起来。

> 目标结果：本地运行一个 REST API，地址为 `http://localhost:3000/api/products`，可以对商品做增、删、改、查。

---

## 一、开始之前需要准备什么

| 准备项 | 说明 |
|---|---|
| 操作系统 | Windows、macOS、Linux 均可；下文分别给出本地 MongoDB 的启动方式 |
| 现代浏览器 | Chrome、Edge、Firefox、Safari 均可 |
| Node.js | 20 或更高版本；用 `node -v` 检查 |
| npm | 随 Node.js 一起安装；用 `npm -v` 检查 |
| MongoDB | 二选一：本地 MongoDB，或 MongoDB Atlas 账号 |

本文默认使用**本地 MongoDB**，因为它不需要注册账号，最快能跑通。如果你使用 Atlas，后面也给出了对应填写方式。

检查 Node.js 版本：

```bash
node -v
npm -v
```

如果版本低于 20，请先到 https://nodejs.org/ 安装 LTS 版本。

---

## 二、整体流程一览

```text
打开网页应用
  → 切换为中文（可选）
  → 填写模型名称 Product
  → 选择 MongoDB 连接方式
  → 添加属性
  → 设置路由风格 / 端口 / 时间戳
  → 点击“生成 API 项目”
  → 检查生成的文件和测试计划
  → 点击“下载项目（.zip）”
  → 解压 product-api.zip
  → npm install
  → npm run dev
  → 用 curl 或 API 测试工具验证
```

---

## 三、打开网页应用

打开中文版应用：

https://johnnylin707.github.io/apiGen-Chinese/

页面默认可能是英文。如果想用中文操作，点击页面右上角的 **「中文」** 按钮，整页会切换为中文，包括表单、按钮、提示和测试计划。再次点击 **「English」** 可切回英文。

语言选择会保存在浏览器中，刷新后不需要重新切换。

---

## 四、填写模型信息

### 1. 模型名称

在 **模型名称** 输入框中填写：

```text
Product
```

注意：

- 使用**单数**，表示“一条记录”的类型。
- 只能使用字母、数字和下划线，并且要以字母开头。
- 不要写成 `product-api`，连字符在模型名称里不合法；`product-api` 是最后生成的项目文件夹名。

### 2. 复数形式

填完 `Product` 后，**复数形式（URL 和集合）** 会自动变成：

```text
products
```

这个值决定两件事：

- API 地址：`/api/products`
- MongoDB 集合名称：`products`

可以手动修改，但本示例保持 `products` 不变。

此时页面下方的提示应类似：

> 已自动填充；可按需修改。用于 `/api/products` 和集合 `products`。

---

## 五、配置 MongoDB 连接

页面默认选中的是 **MongoDB Atlas**。本示例改用本地 MongoDB。

### 方案 A：使用本地 MongoDB（推荐先跑通）

#### 1. 安装并确认 MongoDB 已启动

##### macOS（Homebrew 安装）

启动 MongoDB 服务：

```bash
brew services start mongodb-community
```

确认是否监听默认端口 `27017`：

```bash
lsof -i :27017
```

如果能看到 `mongod` 进程，说明 MongoDB 已启动。

##### Windows（官方 MSI 安装，推荐）

1. 下载 MongoDB Community Server 的 MSI 安装包：  
   https://www.mongodb.com/try/download/community  
   选择当前稳定版本，Platform 选 **Windows**，Package 选 **MSI**。

2. 双击安装包，安装类型选择 **Complete**。

3. 到 **Service Configuration** 页面时，保持勾选 **Install MongoDB as a Service**，服务名保持默认的 `MongoDB`。数据目录和日志目录保持默认即可，通常类似：

   ```text
   C:\Program Files\MongoDB\Server\<版本号>\data
   C:\Program Files\MongoDB\Server\<版本号>\log
   ```

4. 安装完成后，以**管理员身份**打开 PowerShell，检查服务状态：

   ```powershell
   Get-Service MongoDB
   ```

   如果 `Status` 是 `Stopped`，启动它：

   ```powershell
   Start-Service MongoDB
   ```

   也可以在管理员命令提示符中执行 `net start MongoDB`。如果提示服务已经启动，可以直接进入下一步。

5. 检查默认端口 `27017` 是否被监听：

   ```powershell
   netstat -ano | findstr :27017
   ```

   看到 `LISTENING` 就说明 MongoDB 已启动。

6. 可选：验证能否连接。先把 MongoDB 的 `bin` 目录加入 PATH：

   ```text
   C:\Program Files\MongoDB\Server\<版本号>\bin
   ```

   例如 `C:\Program Files\MongoDB\Server\8.0\bin`。然后执行：

   ```powershell
   mongosh "mongodb://127.0.0.1:27017/productdb"
   ```

   能进入 MongoDB Shell 就说明本地 MongoDB 可用，输入 `exit` 退出即可。

   如果不想改 PATH，也可以直接用完整路径执行：

   ```powershell
   & "C:\Program Files\MongoDB\Server\<版本号>\bin\mongosh.exe" --eval "db.runCommand({ ping: 1 })"
   ```

   看到返回中包含 `ok: 1` 就说明连接正常。如果安装器没有附带 `mongosh`，可以单独安装 MongoDB Shell：  
   https://www.mongodb.com/try/download/shell

> 如果安装时没有把 MongoDB 安装成服务，也可以手动启动。创建数据目录并在 PowerShell 中运行：
>
> ```powershell
> mkdir C:\data\db
> & "C:\Program Files\MongoDB\Server\<版本号>\bin\mongod.exe" --dbpath C:\data\db
> ```
>
> 这个窗口要保持打开；关闭窗口会停止 MongoDB。

##### Linux（补充）

如果使用 systemd，通常可以用：

```bash
sudo systemctl start mongod
sudo systemctl status mongod
```

#### 2. 在网页中选择本地 MongoDB

在 **MongoDB 连接** 区域，点选：

```text
本地 MongoDB（127.0.0.1:27017）
```

选择后，Atlas 的用户名、密码、集群地址输入框会隐藏，只需要填写数据库名称。

#### 3. 填写数据库名称

在 **数据库名称 \*** 中填写：

```text
productdb
```

应用会生成连接字符串：

```text
mongodb://127.0.0.1:27017/productdb
```

这个字符串会被写入项目里的 `.env` 文件，不会写进 `server.js`。

---

### 方案 B：使用 MongoDB Atlas

如果你没有本地 MongoDB，可以改用 Atlas：

1. 在 https://www.mongodb.com/atlas 注册/登录。
2. 创建一个免费集群（M0）。
3. 在 **Database Access** 创建数据库用户，记下用户名和密码。
4. 在 **Network Access** 放行你的 IP；测试阶段也可以临时放行 `0.0.0.0/0`。
5. 在 **Connect** 里复制集群地址，例如：

   ```text
   cluster0.ab1cd.mongodb.net
   ```

然后在网页中保持选中 **MongoDB Atlas**，并填写：

| 字段 | 示例值 |
|---|---|
| 数据库用户 | `shopuser` |
| 数据库用户密码 | `your-password` |
| 集群地址 | `cluster0.ab1cd.mongodb.net` |
| 数据库名称 | `productdb` |

应用会自动把密码做 URL 编码，并生成类似下面的连接字符串写入 `.env`：

```text
mongodb+srv://shopuser:your-password@cluster0.ab1cd.mongodb.net/productdb?retryWrites=true&w=majority
```

> 如果你已经有一整条连接字符串，也可以选择 **粘贴连接字符串**，直接填写包含数据库名称的完整 URI。

---

## 六、添加模型属性

在 **模型属性** 区域，页面初始会有一行空白属性。本示例需要 5 个属性。

按下表依次填写：

| 属性名称 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `name` | String | 是 | 商品名称 |
| `price` | Number | 是 | 价格 |
| `category` | String | 是 | 分类 |
| `inStock` | Boolean | 否 | 是否有库存 |
| `releaseDate` | Date | 否 | 发布日期 |

操作步骤：

1. 第一行填写 `name`，类型选 **String**，勾选 **必填**。
2. 点击 **+ 添加属性**，新增第二行，填写 `price`，类型选 **Number**，勾选 **必填**。
3. 再新增第三行，填写 `category`，类型选 **String**，勾选 **必填**。
4. 新增第四行，填写 `inStock`，类型选 **Boolean**，取消勾选 **必填**。
5. 新增第五行，填写 `releaseDate`，类型选 **Date**，取消勾选 **必填**。

注意：

- 属性名只能使用字母、数字和下划线，并且以字母开头。
- 不要添加 `createdAt` 或 `updatedAt`，因为它们会由时间戳选项自动生成。
- 至少要有一个属性，否则生成时会报错。

---

## 七、设置路由风格、端口和时间戳

在 **选项** 区域按下面填写：

| 设置项 | 选择/填写 | 说明 |
|---|---|---|
| 路由风格 | `REST: POST /, PUT /:id, DELETE /:id (recommended)` | 本示例用标准 REST 路由 |
| 端口 | `3000` | 本地访问地址是 `http://localhost:3000` |
| 添加 createdAt / updatedAt（时间戳） | 勾选 | Mongoose 自动维护这两个字段 |

保持默认即可；只要确认端口是 `3000`、时间戳是勾选状态。

此时最终接口会是：

| 方法 | 路径 | 作用 |
|---|---|---|
| GET | `/api/products` | 列出所有商品 |
| GET | `/api/products/:id` | 获取一个商品 |
| POST | `/api/products` | 创建商品 |
| PUT | `/api/products/:id` | 更新商品 |
| DELETE | `/api/products/:id` | 删除商品 |

---

## 八、生成项目

点击绿色的 **生成 API 项目** 按钮。

如果填写有误，页面中间会出现红色错误提示，例如：

- `请输入模型名称：一条记录的单数名称。`
- `请至少添加一个属性。`
- `请输入数据库名称（字母、数字、- 或 _）。`

按提示修改后再次点击生成。

生成成功后，页面会出现两块内容：

### 1. 生成的项目

顶部有文件标签页，默认显示 `server.js`。可以逐个点击切换：

| 文件 | 内容 |
|---|---|
| `server.js` | API 主程序 |
| `.env` | 数据库连接字符串和端口 |
| `.env.example` | 可分享的示例配置 |
| `package.json` | 依赖和启动脚本 |
| `.gitignore` | 忽略 `node_modules/` 和 `.env` |
| `README.md` | 生成项目的说明文档 |

### 2. 测试你的 API

页面下方会出现 8 个按顺序列出的请求，以及 3 份示例 JSON。它们是网页应用自动根据你的模型生成的，用来验证项目是否正确。

---

## 九、下载 ZIP 文件

在 **生成的项目** 区域，点击 **下载项目（.zip）**。

浏览器会下载一个文件：

```text
product-api.zip
```

下载位置通常在浏览器的“下载”目录。

> 如果浏览器拦截了下载，请允许该站点下载多个文件，或检查浏览器的下载提示。

---

## 十、解压并运行项目

### 1. 解压

在 macOS / Linux 上可以用命令：

```bash
cd ~/Downloads
unzip product-api.zip
cd product-api
```

Windows 用户可以直接右键 `product-api.zip`，选择“全部提取”，然后进入解压出来的 `product-api` 文件夹。

也可以用 PowerShell 解压：

```powershell
cd $env:USERPROFILE\Downloads
Expand-Archive -Path .\product-api.zip -DestinationPath . -Force
cd product-api
```

后续 `npm install` 和 `npm run dev` 在 Windows PowerShell、cmd 或 macOS/Linux 终端中的写法相同。

解压后的目录结构：

```text
product-api/
├── .env
├── .env.example
├── .gitignore
├── README.md
├── package.json
└── server.js
```

### 2. 确认 `.env`

打开 `.env`，如果使用本地 MongoDB，应类似：

```env
MONGODB_URI=mongodb://127.0.0.1:27017/productdb
PORT=3000
```

如果使用 Atlas，则 `MONGODB_URI` 会是 `mongodb+srv://...` 开头的完整连接字符串。

注意：`.env` 含数据库密码，不要提交到 Git。项目里的 `.gitignore` 已经忽略了它。

### 3. 安装依赖

在 `product-api` 目录中运行：

```bash
npm install
```

首次安装需要联网，等待完成即可。

### 4. 启动服务

```bash
npm run dev
```

如果一切正常，终端会显示：

```text
Connected to MongoDB
Product API listening on http://localhost:3000
```

看到这两行，说明 API 已经跑起来了。

> 如果使用 Atlas 但启动失败，请检查 Atlas 的 Network Access 是否放行了你的 IP，以及用户名、密码、集群地址是否正确。
>
> 如果使用本地 MongoDB，请确认 `mongod` 正在运行，且端口是 `27017`。

---

## 十一、验证 API 是否可用

### 方式一：浏览器快速检查

打开：

```text
http://localhost:3000/
```

应看到欢迎信息，以及接口地址 `/api/products`。

再打开：

```text
http://localhost:3000/api/products
```

第一次访问通常会返回空数组：

```json
[]
```

### 方式二：用 curl 完整测试

> **Windows PowerShell 注意**：`curl` 是 `Invoke-WebRequest` 的别名，且不支持用 `\` 续行。请把下面命令中的 `curl` 改为 `curl.exe`，并把命令写成一行。例如：
>
> ```powershell
> curl.exe -X POST http://localhost:3000/api/products -H "Content-Type: application/json" -d '{"name":"Laptop","price":999.99,"category":"Electronics","inStock":true,"releaseDate":"2026-01-15"}'
> ```
>
> 也可以打开 **cmd** 或 **Git Bash**，直接复制下面的 bash 命令。

#### 1. 创建商品

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "price": 999.99,
    "category": "Electronics",
    "inStock": true,
    "releaseDate": "2026-01-15"
  }'
```

应返回 `201`，并带有 `_id`，例如：

```json
{
  "_id": "65a1b2c3d4e5f60718293a4b",
  "name": "Laptop",
  "price": 999.99,
  "category": "Electronics",
  "inStock": true,
  "releaseDate": "2026-01-15T00:00:00.000Z",
  "createdAt": "2026-11-25T09:00:00.000Z",
  "updatedAt": "2026-11-25T09:00:00.000Z",
  "__v": 0
}
```

复制这个 `_id`，后面的请求会用到。

#### 2. 列出所有商品

```bash
curl http://localhost:3000/api/products
```

应返回 `200` 和一个数组，数组里包含刚创建的商品。

#### 3. 获取一个商品

把 `<_id>` 换成上一步复制的 ID：

```bash
curl http://localhost:3000/api/products/<_id>
```

应返回 `200` 和该商品详情。

#### 4. 更新商品价格

```bash
curl -X PUT http://localhost:3000/api/products/<_id> \
  -H "Content-Type: application/json" \
  -d '{"price": 899.99}'
```

应返回 `200`，其中 `price` 已变成 `899.99`。其他字段保持不变。

#### 5. 删除商品

```bash
curl -X DELETE http://localhost:3000/api/products/<_id>
```

应返回 `204`，没有响应体。

#### 6. 再次获取已删除商品

```bash
curl http://localhost:3000/api/products/<_id>
```

应返回 `404`，错误信息类似：

```json
{
  "error": {
    "message": "Product not found."
  }
}
```

### 方式三：用网页自带的测试计划

回到网页应用下方的 **测试你的 API** 区域，按 1～8 的顺序发送请求即可。页面已经把方法、URL、请求体、预期状态码都列好了，适合用 Thunder Client 或 Postman 操作。

---

## 十二、常见错误排查

| 现象 | 可能原因 | 处理办法 |
|---|---|---|
| 生成时提示“请输入模型名称” | 模型名称为空 | 填写 `Product` |
| 生成时提示“请至少添加一个属性” | 没有添加属性 | 至少添加一个，例如 `name` |
| 生成时提示模型名称不合法 | 使用了连字符、空格或数字开头 | 改成 `Product` |
| `npm run dev` 报连接错误 | MongoDB 没启动或连接字符串错误 | 检查 `.env` 和 MongoDB 服务 |
| Windows 执行 `net start MongoDB` 提示“服务名无效” | 安装时未勾选“Install MongoDB as a Service”，或服务名不是 `MongoDB` | 重新运行 MSI 安装并勾选服务；或打开 `services.msc` 查实际服务名；也可手动运行 `mongod.exe --dbpath C:\data\db` |
| Windows 提示找不到 `mongod` / `mongosh` | 安装目录未加入 PATH | 把 `C:\Program Files\MongoDB\Server\<版本号>\bin` 加入 PATH，或直接使用完整路径运行 `mongosh.exe` |
| Windows 下 `netstat` 看不到 `27017` | 服务未启动，或配置里改过端口 | 以管理员身份执行 `Start-Service MongoDB`；再检查 `C:\Program Files\MongoDB\Server\<版本号>\bin\mongod.cfg` 中的 `net.port` |
| Windows PowerShell 执行 `curl` 报参数错误 | `curl` 是 `Invoke-WebRequest` 的别名 | 改用 `curl.exe`，或切换到 cmd / Git Bash |
| Atlas 连接超时 | IP 未放行 | 在 Atlas 的 Network Access 中放行当前 IP |
| 访问接口返回 404 | 路径写错 | 确认是 `/api/products`，不是 `/api/product` |
| PUT 后提示必填字段校验失败 | 请求体中把必填字段传成了 `null` 或空字符串 | 只发送要修改的字段，例如 `{"price": 899.99}`；必填字段不要传空值 |
| 端口被占用 | 3000 已被其他程序使用 | 修改网页里的端口，或停止占用 3000 的程序 |

---

## 十三、本示例最终填写清单

| 区域 | 填写内容 |
|---|---|
| 模型名称 | `Product` |
| 复数形式 | `products` |
| MongoDB 连接方式 | 本地 MongoDB |
| 数据库名称 | `productdb` |
| 属性 1 | `name`，String，必填 |
| 属性 2 | `price`，Number，必填 |
| 属性 3 | `category`，String，必填 |
| 属性 4 | `inStock`，Boolean，非必填 |
| 属性 5 | `releaseDate`，Date，非必填 |
| 路由风格 | REST（推荐） |
| 端口 | `3000` |
| 时间戳 | 勾选 |
| 下载文件 | `product-api.zip` |
| 解压目录 | `product-api` |
| 启动命令 | `npm run dev` |
| 基础地址 | `http://localhost:3000/api/products` |

按上面清单操作完，你就拥有了一个可运行、可测试的 `product-api` REST API 项目。
