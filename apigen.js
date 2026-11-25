/*
   apiGen: generates a complete Node.js REST API project (Express 5 + MongoDB/Mongoose 9) from a model you describe.
   ApiGen.build(spec) is a pure function (no DOM): it returns { files, errors }, so it can be tested in Node too.
   The UI code at the bottom only runs in a browser.
*/

/* Chinese translations used by the page UI (generated project files stay in English). */
const I18N = {
  title: '自定义 API 生成器',
  description: '根据描述生成一个完整的 Node.js REST API 项目（Express 5、MongoDB、Mongoose），连接字符串安全保存在 .env 中。',
  heading: '<span class="text-indigo-600">自定义</span> API 生成器',
  intro: '描述一个模型，即可获得完整的 Node.js REST API 项目：Express 5、MongoDB 和 Mongoose 9，连接字符串安全保存在 <code>.env</code> 中。',
  modelName: '模型名称',
  modelPlaceholder: '单条记录的名称，使用单数（例如 Product）',
  modelHint: 'API 存储的对象类型，使用单数形式，类似类名。',
  pluralName: '复数形式（URL 和集合）',
  pluralPlaceholder: '根据模型名称自动填充（例如 products）',
  pluralHintPrefix: '已自动填充；可按需修改。用于 ',
  pluralHintFilled: '<code>/api/{p}</code> 和集合 <code>{p}</code>',
  pluralHintEmpty: 'URL <code>/api/&lt;plural&gt;</code> 和集合名称',
  connection: 'MongoDB 连接',
  dbLocal: '本地 MongoDB（127.0.0.1:27017）',
  dbPaste: '粘贴连接字符串',
  dbUser: '数据库用户（Atlas › Database Access）',
  dbUserPlaceholder: '数据库用户名（例如 shopuser）',
  dbPassword: '数据库用户密码',
  dbPasswordPlaceholder: '该用户的密码（例如 Sh0p-Pass!）',
  clusterAddress: '集群地址',
  clusterPlaceholder: '集群地址（例如 cluster0.ab1cd.mongodb.net）',
  fullUri: '连接字符串（包含数据库名称）',
  fullUriPlaceholder: '例如：mongodb+srv://shopuser:pass@cluster0.ab1cd.mongodb.net/shopdb',
  databaseName: '数据库名称 <span class="text-red-500">*</span>',
  databasePlaceholder: '数据库名称（例如 shopdb）',
  privacy: '所有内容都保留在浏览器中：不会发送到任何地方。连接字符串（含密码）会写入 <code>.env</code>，而不是 <code>server.js</code>。',
  attributes: '模型属性',
  addAttribute: '+ 添加属性',
  attrName: '属性名称',
  attrNamePlaceholder: '属性名称（例如 price）',
  attrType: '属性类型',
  typeString: '字符串 String',
  typeNumber: '数字 Number',
  typeBoolean: '布尔值 Boolean',
  typeDate: '日期 Date',
  required: '必填',
  remove: '移除',
  routeStyle: '路由风格',
  routeRest: 'REST：POST /、PUT /:id、DELETE /:id（推荐）',
  routeClassic: '经典：/add、/update/:id、/delete/:id',
  port: '端口',
  timestamps: '添加 createdAt / updatedAt（时间戳）',
  generate: '生成 API 项目',
  generatedProject: '生成的项目',
  copyFile: '复制此文件',
  downloadZip: '下载项目（.zip）',
  fileTabsLabel: '项目文件',
  fileContents: '文件内容',
  nextSteps: '接下来：解压，运行 <code>npm install</code>、<code>npm run dev</code>。项目中的 README 列出了每个接口及测试命令。',
  testApi: '测试你的 API',
  testStep1: '启动 API：解压项目，然后运行 <code>npm install</code> 和 <code>npm run dev</code>。等待出现 <em>Connected to MongoDB</em>。',
  testStep2: '在 API 测试工具（例如 VS Code 的 Thunder Client）中，依次创建下面的请求。选择方法、粘贴 URL，请求体选择 <strong>Body › raw › JSON</strong>。完成请求 1 后，从响应中复制 <code>_id</code>，并在 URL 显示 <code>&lt;id&gt;</code> 的地方使用它。',
  sampleJson: '用于创建记录的示例 JSON',
  sampleIntro: '将下面的每个请求体各发送一次 <strong>POST</strong> <code id="sampleUrl"></code>（<strong>Body › raw › JSON</strong>），即可向数据库写入一些数据。每个请求都会返回 <strong>201</strong>，以及保存的记录和它的 <code>_id</code>。',
  testEveryEndpoint: '依次测试每个接口',
  expect: '预期',
  sample: '示例',
  copy: '复制',
  copied: '已复制',
  source: '来源：',
  donateIntro: '如果你喜欢这个应用并享受使用，可以通过以下方式随意打赏：',
  or: '或',
  donateOutro: '你的支持鼓励我创作更多类似的实用应用！',
  copyright: '版权所有 &copy; Reza Ghaeli 2025&ndash;2026'
};

/* Exact messages emitted by the generator and the UI. Patterns are handled by translateText(). */
const MESSAGES_ZH = {
  'Copy': '复制',
  'Copied': '已复制',
  'Enter a model name: the singular name of one record.': '请输入模型名称：一条记录的单数名称。',
  'The model name must start with a letter and use only letters and numbers.': '模型名称必须以字母开头，且只能包含字母和数字。',
  'The plural (used in the URL and as the collection name) may only use letters, numbers and dashes.': '复数形式（用于 URL 和集合名称）只能包含字母、数字和连字符。',
  'Paste a connection string that starts with mongodb:// or mongodb+srv://': '请粘贴以 mongodb:// 或 mongodb+srv:// 开头的连接字符串',
  'Enter a database name (letters, numbers, - or _).': '请输入数据库名称（字母、数字、- 或 _）。',
  'Enter the database user and password (Atlas › Database Access).': '请输入数据库用户和密码（Atlas › Database Access）。',
  'Enter your cluster address from Atlas › Connect (it ends in .mongodb.net).': '请输入 Atlas › Connect 中的集群地址（以 .mongodb.net 结尾）。',
  'Add at least one attribute.': '请至少添加一个属性。',
  'The .zip library did not load: copy the files one by one instead.': '.zip 库未能加载：请改为逐个复制文件。'
};

const ApiGen = (() => {
  const JS_RESERVED = new Set(('break case catch class const continue debugger default delete do else enum export extends false finally for ' +
    'function if import in instanceof let new null return super switch this throw true try typeof var void while with yield ' +
    'await static implements interface package private protected public arguments eval undefined NaN Infinity').split(' '));
  /* names the generated server.js already uses */
  const TAKEN = new Set('express mongoose cors app port router start require module exports process console req res next err dotenv'.split(' '));
  const GLOBALS = new Set('Error Object Array String Number Boolean Date Promise JSON Math Map Set WeakMap WeakSet Symbol RegExp Function Reflect Proxy Intl BigInt Buffer URL Schema'.split(' '));
  const SYSTEM_FIELDS = new Set(['_id', 'id', '__v']);
  const IDENT = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

  /* English plurals, used for the URL path AND the collection name (passed to mongoose.model so they always match) */
  const IRREGULAR = { person: 'people', child: 'children', man: 'men', woman: 'women', mouse: 'mice', goose: 'geese', tooth: 'teeth',
    foot: 'feet', datum: 'data', ox: 'oxen', criterion: 'criteria', analysis: 'analyses', thesis: 'theses', crisis: 'crises', index: 'indexes' };
  const SAME = new Set(['series', 'species', 'news', 'fish', 'sheep', 'deer', 'equipment', 'information', 'rice', 'money', 'feedback', 'data']);
  const F_TO_VES = new Set(['leaf', 'knife', 'wolf', 'life', 'wife', 'half', 'shelf', 'loaf', 'thief', 'calf', 'elf', 'self']);
  const O_TO_OES = new Set(['hero', 'potato', 'tomato', 'echo', 'veto', 'torpedo']);
  function pluralize(word) {
    const w = String(word);
    const lower = w.toLowerCase();
    const keep = s => w === lower ? s : w[0] + s.slice(1);   // keep a leading capital
    if (SAME.has(lower)) return w;
    if (IRREGULAR[lower]) return keep(IRREGULAR[lower]);
    if (F_TO_VES.has(lower)) return keep(lower.replace(/fe?$/, 'ves'));
    if (O_TO_OES.has(lower)) return w + 'es';
    if (/quiz$/i.test(w)) return w + 'zes';
    if (/[^aeiou]y$/i.test(w)) return w.slice(0, -1) + 'ies';
    if (/(s|x|z|ch|sh)$/i.test(w)) return w + 'es';
    return w + 's';
  }

  const pascal = s => String(s).trim().replace(/[^A-Za-z0-9]+(.)?/g, (m, c) => (c ? c.toUpperCase() : '')).replace(/^./, c => c.toUpperCase());
  const camel = s => { const p = pascal(s); return p.charAt(0).toLowerCase() + p.slice(1); };
  const kebab = s => String(s).replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase();
  const q = s => "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";   // a safe single-quoted JS string

  /* the connection string that goes in .env (never in server.js) */
  function connectionString(c) {
    const db = (c.database || '').trim();
    if (c.mode === 'uri') return (c.uri || '').trim();
    if (c.mode === 'local') return 'mongodb://127.0.0.1:27017/' + db;
    let host = (c.host || '').trim().replace(/^mongodb(\+srv)?:\/\//i, '').replace(/^[^@/]*@/, '').replace(/[/?].*$/, '');
    return 'mongodb+srv://' + encodeURIComponent((c.user || '').trim()) + ':' + encodeURIComponent(c.password || '') + '@' + host + '/' + db +
      '?retryWrites=true&w=majority';
  }

  function validate(spec) {
    const errors = [];
    const model = pascal(spec.model || '');
    if (!model) errors.push('Enter a model name: the singular name of one record.');
    else if (!IDENT.test(model) || /^[0-9]/.test(model)) errors.push('The model name must start with a letter and use only letters and numbers.');
    else if (GLOBALS.has(model) || JS_RESERVED.has(model)) errors.push('"' + model + '" is a built-in JavaScript name: choose another model name.');
    const plural = (spec.plural || '').trim();
    if (plural && !/^[a-z0-9][a-z0-9-]*$/i.test(plural)) errors.push('The plural (used in the URL and as the collection name) may only use letters, numbers and dashes.');
    const c = spec.connection || {};
    if (c.mode === 'uri') {
      if (!/^mongodb(\+srv)?:\/\/\S+$/.test((c.uri || '').trim())) errors.push('Paste a connection string that starts with mongodb:// or mongodb+srv://');
    } else {
      if (!/^[A-Za-z0-9_-]{1,63}$/.test((c.database || '').trim())) errors.push('Enter a database name (letters, numbers, - or _).');
      if (c.mode === 'atlas') {
        if (!(c.user || '').trim() || !c.password) errors.push('Enter the database user and password (Atlas › Database Access).');
        if (!/\.mongodb\.net/i.test(c.host || '') && !/\./.test(c.host || '')) errors.push('Enter your cluster address from Atlas › Connect (it ends in .mongodb.net).');
      }
    }
    const attrs = spec.attributes || [];
    if (!attrs.length) errors.push('Add at least one attribute.');
    const seen = new Set();
    attrs.forEach((a, i) => {
      const n = (a.name || '').trim();
      const where = 'Attribute ' + (i + 1);
      if (!n) errors.push(where + ': enter a name.');
      else if (!IDENT.test(n)) errors.push(where + ' "' + n + '": use letters, numbers and _ only, starting with a letter (e.g. firstName).');
      else if (JS_RESERVED.has(n)) errors.push(where + ' "' + n + '" is a JavaScript keyword: choose another name.');
      else if (SYSTEM_FIELDS.has(n) || (spec.timestamps && (n === 'createdAt' || n === 'updatedAt'))) errors.push(where + ' "' + n + '" is added automatically: remove it.');
      else if (seen.has(n)) errors.push(where + ' "' + n + '" is used twice.');
      seen.add(n);
    });
    return errors;
  }

  const SAMPLE = { String: '"example"', Number: '1', Boolean: 'true', Date: '"2026-01-31"' };

  /* ---------------------------------------------------------------- testing: the requests shown on the page */
  /* three different records to POST, so the collection has some data to read, update and delete */
  function sampleRecords(attrs, Model) {
    const label = n => n.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/^./, c => c.toUpperCase());
    const modelWords = Model.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
    return [1, 2, 3].map(i => {
      const o = {};
      attrs.forEach(a => {
        o[a.name] = a.type === 'Number' ? i * 10 : a.type === 'Boolean' ? i % 2 === 1
          : a.type === 'Date' ? '2026-0' + i + '-15'
          : /^(name|title|label)$/i.test(a.name) ? modelWords + ' ' + i : label(a.name) + ' ' + i;
      });
      return o;
    });
  }
  const sampleValue = (a, updated) => a.type === 'Number' ? (updated ? 43 : 42) : a.type === 'Boolean' ? !updated
    : a.type === 'Date' ? (updated ? '2026-02-28' : '2026-01-31') : (updated ? 'Updated ' : 'Example ') + a.name;
  function testPlan({ Model, one, base, P, attrs, host }) {
    /* words for people, not variables: "order item", "an order item", "order items" */
    const words = Model.replace(/([a-z0-9])([A-Z])/g, '$1 $2').toLowerCase();
    const many = words.replace(/\S+$/, w => pluralize(w));
    const a = (/^[aeiou]/.test(words) ? 'an ' : 'a ') + words;
    one = words;
    const full = {}; attrs.forEach(a => { full[a.name] = sampleValue(a, false); });
    const first = attrs[0], change = { [first.name]: sampleValue(first, true) };
    const req = attrs.filter(a => a.required);
    const num = attrs.find(a => a.type === 'Number');
    const bad = req.length ? {} : num ? { [num.name]: 'not a number' } : null;
    const at = p => base + (p === '/' ? '' : p.replace(':id', '{{id}}'));
    const list = [
      { name: 'Create ' + a, nameZh: '创建 ' + words, method: 'POST', url: at(P.create), body: full, expect: 201,
        why: 'Saves a new ' + words + ' and sends it back with its new _id. Copy that _id: the next requests use it.',
        whyZh: '保存一个新的 ' + words + '，并返回它及新的 _id。复制该 _id：后续请求会用到它。' },
      { name: 'List all ' + many, nameZh: '列出所有 ' + many, method: 'GET', url: base, expect: 200,
        why: 'An array with every ' + words + ', including the one you just created.',
        whyZh: '包含所有 ' + words + ' 的数组，包括刚创建的那个。' },
      { name: 'Get one ' + one, nameZh: '获取一个 ' + words, method: 'GET', url: base + '/{{id}}', expect: 200,
        why: 'Only the ' + one + ' whose _id is in the URL.', whyZh: '只返回 URL 中 _id 对应的那个 ' + words + '。' },
      { name: 'Update the ' + one, nameZh: '更新该 ' + words, method: 'PUT', url: at(P.update), body: change, expect: 200,
        why: 'Send only the fields to change: ' + first.name + ' changes, the other fields stay. The reply is the updated ' + one + '.',
        whyZh: '只发送要修改的字段：' + first.name + ' 会变化，其他字段保持不变。返回更新后的 ' + words + '。' },
      bad && { name: 'Create with bad data', nameZh: '用错误数据创建', method: 'POST', url: at(P.create), body: bad, expect: 400,
        why: req.length ? 'Required fields are missing, so Mongoose refuses it (ValidationError) and nothing is saved.' : 'A value of the wrong type is refused (ValidationError).',
        whyZh: req.length ? '缺少必填字段，Mongoose 会拒绝（ValidationError），不会保存任何内容。' : '值类型错误，会被拒绝（ValidationError）。' },
      { name: 'Get with an invalid id', nameZh: '用无效 id 获取', method: 'GET', url: base + '/abc', expect: 400,
        why: '"abc" is not a 24-character ObjectId (CastError).', whyZh: '"abc" 不是 24 位 ObjectId（CastError）。' },
      { name: 'Delete the ' + one, nameZh: '删除该 ' + words, method: 'DELETE', url: at(P.remove), expect: 204,
        why: 'Removes it. 204 means: done, no body.', whyZh: '删除该记录。204 表示：操作完成，无响应体。' },
      { name: 'Get the deleted ' + one, nameZh: '获取已删除的 ' + words, method: 'GET', url: base + '/{{id}}', expect: 404,
        why: 'It is gone, so the API answers ' + Model + ' not found.', whyZh: '记录已不存在，API 会返回 ' + Model + ' not found。' }
    ].filter(Boolean);
    return list;
  }


  function build(spec) {
    const errors = validate(spec);
    if (errors.length) return { errors, files: null };
    const Model = pascal(spec.model);
    const plural = ((spec.plural || '').trim() || pluralize(camel(spec.model))).toLowerCase();
    let one = camel(spec.model), many = camel(plural.replace(/-/g, ' '));
    if (TAKEN.has(one) || JS_RESERVED.has(one) || one === many) one = 'item';
    if (TAKEN.has(many) || JS_RESERVED.has(many) || many === one) many = 'items';
    const aOne = (/^[aeiou]/i.test(one) ? 'an ' : 'a ') + one;   // "an item", "a product"
    const schemaVar = camel(spec.model) + 'Schema';
    const attrs = spec.attributes.map(a => ({ name: a.name.trim(), type: a.type || 'String', required: !!a.required }));
    const fields = attrs.map(a => a.name).join(', ');
    const classic = spec.routeStyle === 'classic';
    const base = '/api/' + plural;
    const P = { create: classic ? '/add' : '/', update: classic ? '/update/:id' : '/:id', remove: classic ? '/delete/:id' : '/:id' };
    const port = String(spec.port || 3000).replace(/\D/g, '') || '3000';
    const uri = connectionString(spec.connection || {});

    const schemaLines = attrs.map(a => {
      const opts = ['type: ' + a.type];
      if (a.required) opts.push('required: true');
      if (a.type === 'String') opts.push('trim: true');
      return '    ' + a.name + ': { ' + opts.join(', ') + ' }';
    }).join(',\n');

    const route = (method, path, comment, body) => `// ${comment}\nrouter.${method}(${q(path)}, async (req, res) => {\n${body}\n});`;
    const notFound = `    return res.status(404).json({ error: { message: ${q(Model + ' not found.')} } });`;

    const routes = [
      route('get', '/', `GET ${base} -> every ${one} (200)`,
        `  const ${many} = await ${Model}.find();\n  res.json(${many});`),
      classic ? route('post', P.create, `POST ${base}${P.create} -> create ${aOne} (201)`,
        `  const { ${fields} } = req.body;\n  const ${one} = await ${Model}.create({ ${fields} });\n  res.status(201).json(${one});`) : null,
      classic ? route('put', P.update, `PUT ${base}${P.update} -> update ${aOne}, send back the new version (200)`,
        `  const { ${fields} } = req.body;\n  const ${one} = await ${Model}.findByIdAndUpdate(\n    req.params.id,\n    { ${fields} },\n    { returnDocument: 'after', runValidators: true }   // the updated ${one}; check the schema rules\n  );\n  if (!${one}) {\n${notFound}\n  }\n  res.json(${one});`) : null,
      classic ? route('delete', P.remove, `DELETE ${base}${P.remove} -> remove ${aOne} (204)`,
        `  const ${one} = await ${Model}.findByIdAndDelete(req.params.id);\n  if (!${one}) {\n${notFound}\n  }\n  res.status(204).end();`) : null,
      route('get', '/:id', `GET ${base}/:id -> one ${one} (200), or 404`,
        `  const ${one} = await ${Model}.findById(req.params.id);\n  if (!${one}) {\n${notFound}\n  }\n  res.json(${one});`),
      classic ? null : route('post', '/', `POST ${base} -> create ${aOne} (201)`,
        `  const { ${fields} } = req.body;   // only the fields we accept\n  const ${one} = await ${Model}.create({ ${fields} });\n  res.status(201).json(${one});`),
      classic ? null : route('put', '/:id', `PUT ${base}/:id -> update ${aOne}, send back the new version (200)`,
        `  const { ${fields} } = req.body;   // fields left out stay as they are\n  const ${one} = await ${Model}.findByIdAndUpdate(\n    req.params.id,\n    { ${fields} },\n    { returnDocument: 'after', runValidators: true }   // the updated ${one}; check the schema rules\n  );\n  if (!${one}) {\n${notFound}\n  }\n  res.json(${one});`),
      classic ? null : route('delete', '/:id', `DELETE ${base}/:id -> remove ${aOne} (204)`,
        `  const ${one} = await ${Model}.findByIdAndDelete(req.params.id);\n  if (!${one}) {\n${notFound}\n  }\n  res.status(204).end();`)
    ].filter(Boolean).join('\n\n');

    const server = `// ${Model} API: a REST API with Express 5, MongoDB and Mongoose 9
// Generated by apiGen (https://rezaghaeli.github.io/apiGen/)
// Run it:  npm install   then   npm run dev      (the connection string is in .env)
require('dotenv').config({ quiet: true });   // first: reads .env into process.env
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// ---------------------------------------------------------------- the model
// The schema says what every ${one} document must look like
const ${schemaVar} = new mongoose.Schema(
  {
${schemaLines}
  }${spec.timestamps ? ',\n  { timestamps: true }   // adds createdAt and updatedAt' : ''}
);

// The model reads and writes the ${q(plural)} collection
const ${Model} = mongoose.model(${q(Model)}, ${schemaVar}, ${q(plural)});

// ---------------------------------------------------------------- the app
const app = express();
const port = process.env.PORT || ${port};

app.use(cors());           // let a front end on another origin (e.g. a React app) call this API
app.use(express.json());   // reads JSON request bodies into req.body

app.get('/', (req, res) => {
  res.json({ message: ${q('Welcome to the ' + Model + ' API')}, endpoints: ${q(base)} });
});

// ---------------------------------------------------------------- routes: ${base}
const router = express.Router();
${classic ? '// (fixed paths such as /add come before /:id, so ":id" does not catch them)\n' : ''}
${routes}

app.use(${q(base)}, router);   // every route above starts with ${base}

// ---------------------------------------------------------------- errors
// No route matched: 404
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// The error handler (4 parameters): every error ends up here, as JSON.
// Express 5 sends errors thrown in async routes here by itself.
app.use((err, req, res, next) => {
  if (err.name === 'CastError') {
    return res.status(400).json({ error: { message: 'Invalid ' + err.path + ': ' + err.value } });
  }
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: { message: err.message } });
  }
  if ((err.status || 500) >= 500) console.error(err);
  res.status(err.status || 500).json({ error: { message: err.message } });
});

// ---------------------------------------------------------------- start
// Connect to MongoDB first; only then start listening for requests
async function start() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(${q(Model + ' API listening on http://localhost:')} + port);
    });
  } catch (err) {
    console.error('Could not connect to MongoDB:', err.message);
    process.exit(1);
  }
}

start();
`;

    const pkgName = kebab(Model) + '-api';
    const pkg = JSON.stringify({
      name: pkgName, version: '1.0.0', description: Model + ' REST API (Express, MongoDB, Mongoose), generated by apiGen',
      main: 'server.js', scripts: { start: 'node server.js', dev: 'node --watch server.js' },
      engines: { node: '>=20' },
      dependencies: { cors: '^2.8.5', dotenv: '^17.2.0', express: '^5.1.0', mongoose: '^9.0.0' }
    }, null, 2) + '\n';

    const env = `# Settings for server.js, read by dotenv. This file holds your password:
# keep it private and never commit it (.gitignore already excludes it).
MONGODB_URI=${uri}
PORT=${port}
`;
    const envExample = `# Copy this file to .env and fill in your own values.
MONGODB_URI=${(spec.connection || {}).mode === 'local' ? uri : 'mongodb+srv://<user>:<password>@<cluster-address>/' + ((spec.connection || {}).database || '<database>') + '?retryWrites=true&w=majority'}
PORT=${port}
`;
    const gitignore = 'node_modules/\n.env\n.DS_Store\n';

    const sample = '{ ' + attrs.map(a => '"' + a.name + '": ' + SAMPLE[a.type]).join(', ') + ' }';
    const host = 'http://localhost:' + port;
    const readme = `# ${Model} API

A REST API for **${plural}**, built with Express 5, MongoDB and Mongoose 9. Generated by [apiGen](https://rezaghaeli.github.io/apiGen/).

## Run it

1. Install Node.js 20 or newer.
2. Check \`.env\`: \`MONGODB_URI\` is your connection string${(spec.connection || {}).mode === 'local' ? ' (a local MongoDB must be running)' : ' (in Atlas, also allow your IP address under Network Access)'}.
3. In this folder:

\`\`\`
npm install
npm run dev
\`\`\`

You should see \`Connected to MongoDB\` and \`${Model} API listening on ${host}\`.

## Endpoints

| Method | Path | Does | Success | Errors |
|---|---|---|---|---|
| GET | \`${base}\` | every ${one} | 200 | |
| GET | \`${base}/:id\` | one ${one} | 200 | 404 not found, 400 bad id |
| POST | \`${base}${P.create === '/' ? '' : P.create}\` | create ${aOne} | 201 + the ${one} | 400 invalid data |
| PUT | \`${base}${P.update.replace(/^\//, '/')}\` | update ${aOne} (send only the fields to change) | 200 + the updated ${one} | 404, 400 |
| DELETE | \`${base}${P.remove}\` | delete ${aOne} | 204 | 404, 400 |

Errors come back as JSON: \`{ "error": { "message": "..." } }\`.

## Sample data

To add some ${plural}, send **POST** \`${host}${base}${P.create === '/' ? '' : P.create}\` once with each body below
(in an API tester: Body › raw › JSON). Each one answers 201 with the saved ${one} and its \`_id\`.

${sampleRecords(attrs, Model).map((r, i) => 'Sample ' + (i + 1) + ':\n\n\`\`\`json\n' + JSON.stringify(r, null, 2) + '\n\`\`\`').join('\n\n')}

## Try it (curl, or any API tester such as Thunder Client)

\`\`\`
curl ${host}${base}
curl -X POST ${host}${base}${P.create === '/' ? '' : P.create} -H "Content-Type: application/json" -d '${sample}'
curl ${host}${base}/<an _id from the list>
curl -X PUT ${host}${base}${P.update.replace(':id', '<_id>')} -H "Content-Type: application/json" -d '{ "${attrs[0].name}": ${SAMPLE[attrs[0].type]} }'
curl -X DELETE ${host}${base}${P.remove.replace(':id', '<_id>')}
\`\`\`

## Deploy (for example on Render)

Push the folder to GitHub (\`.env\` is not included), create a Web Service with build command \`npm install\` and start command \`npm start\`, and add \`MONGODB_URI\` as an environment variable. In Atlas › Network Access, allow \`0.0.0.0/0\`.
`;
    const tests = testPlan({ Model, one, base, P, attrs, host });
    const samples = sampleRecords(attrs, Model);
    const files = { 'server.js': server, '.env': env, '.env.example': envExample, 'package.json': pkg, '.gitignore': gitignore, 'README.md': readme };
    return { errors: [], files, folder: pkgName, plural, tests, host, samples, createUrl: host + base + (P.create === '/' ? '' : P.create) };
  }

  return { build, pluralize, connectionString, validate, pascal, testPlan };
})();

if (typeof module !== 'undefined') module.exports = ApiGen;

/* ==================================================================== the page */
if (typeof document !== 'undefined') {
  const $ = id => document.getElementById(id);
  const attributesContainer = $('attributesContainer');
  const messageDiv = $('message');
  const output = $('generatedCode');
  let project = null, current = 'server.js', pluralTouched = false;
  let locale = 'en';
  try { if (localStorage.getItem('apiGen-lang') === 'zh') locale = 'zh'; } catch (e) { /* storage may be unavailable */ }

  function applyI18n(root = document) {
    const zh = locale === 'zh';
    document.documentElement.lang = zh ? 'zh-CN' : 'en';
    document.title = zh ? I18N.title : 'Custom API Generator';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.content = zh ? I18N.description : 'Generate a complete Node.js REST API project (Express 5, MongoDB, Mongoose) from a model you describe.';
    root.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (!el.dataset.i18nEn) el.dataset.i18nEn = el.innerHTML;
      el.innerHTML = zh && I18N[key] ? I18N[key] : el.dataset.i18nEn;
    });
    root.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.dataset.i18nPlaceholder;
      if (!el.dataset.i18nPlaceholderEn) el.dataset.i18nPlaceholderEn = el.placeholder;
      el.placeholder = zh && I18N[key] ? I18N[key] : el.dataset.i18nPlaceholderEn;
    });
    root.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
      const key = el.dataset.i18nAriaLabel;
      if (!el.dataset.i18nAriaLabelEn) el.dataset.i18nAriaLabelEn = el.getAttribute('aria-label') || '';
      el.setAttribute('aria-label', zh && I18N[key] ? I18N[key] : el.dataset.i18nAriaLabelEn);
    });
    $('langToggleBtn').textContent = zh ? 'English' : '中文';
  }

  function translateText(text) {
    if (locale === 'en') return String(text);
    const s = String(text);
    if (MESSAGES_ZH[s]) return MESSAGES_ZH[s];
    let m;
    if ((m = s.match(/^Project generated: (\d+) files\. Download it as a \.zip, or copy the files one by one\. How to test it is below\.$/)))
      return '项目已生成：' + m[1] + ' 个文件。可下载 .zip，或逐个复制文件。下方说明了测试方法。';
    if ((m = s.match(/^(.+) copied to the clipboard\.$/))) return '已复制 ' + m[1] + ' 到剪贴板。';
    if ((m = s.match(/^Downloaded (.+)\.zip\. Unzip it, then run npm install and npm run dev\.$/)))
      return '已下载 ' + m[1] + '.zip。解压后运行 npm install 和 npm run dev。';
    if ((m = s.match(/^"(.+)" is a built-in JavaScript name: choose another model name\.$/)))
      return '"' + m[1] + '" 是 JavaScript 内置名称，请换一个模型名称。';
    if ((m = s.match(/^Attribute (\d+): enter a name\.$/))) return '属性 ' + m[1] + '：请输入名称。';
    if ((m = s.match(/^Attribute (\d+) "(.+)": use letters, numbers and _ only, starting with a letter \(e\.g\. firstName\)\.$/)))
      return '属性 ' + m[1] + ' "' + m[2] + '"：只能使用字母、数字和 _，且以字母开头（例如 firstName）。';
    if ((m = s.match(/^Attribute (\d+) "(.+)" is a JavaScript keyword: choose another name\.$/)))
      return '属性 ' + m[1] + ' "' + m[2] + '" 是 JavaScript 关键字，请换一个名称。';
    if ((m = s.match(/^Attribute (\d+) "(.+)" is added automatically: remove it\.$/)))
      return '属性 ' + m[1] + ' "' + m[2] + '" 会自动添加，请移除。';
    if ((m = s.match(/^Attribute (\d+) "(.+)" is used twice\.$/)))
      return '属性 ' + m[1] + ' "' + m[2] + '" 重复使用了。';
    return s;
  }

  let messageState = null;
  function showMessage(msg, type = 'success', keep) {
    messageState = { text: String(msg), type, keep: !!keep };
    messageDiv.textContent = translateText(messageState.text);
    messageDiv.className = 'text-center text-sm font-medium mb-4 min-h-5 whitespace-pre-line ' + (type === 'success' ? 'text-green-700' : 'text-red-700');
    clearTimeout(showMessage.t);
    if (!keep) showMessage.t = setTimeout(() => { messageDiv.textContent = ''; messageState = null; }, 4000);
  }

  function toggleLang() {
    locale = locale === 'zh' ? 'en' : 'zh';
    try { localStorage.setItem('apiGen-lang', locale); } catch (e) { /* storage may be unavailable */ }
    applyI18n(document);
    pluralHint();
    if (project) renderTests();
    if (messageState) showMessage(messageState.text, messageState.type, messageState.keep);
  }

  function addAttributeRow(name = '', type = 'String', required = true) {
    const row = document.createElement('div');
    row.className = 'attribute-row flex flex-col sm:flex-row gap-3 items-center p-3 bg-gray-50 rounded-lg border border-gray-200';
    row.innerHTML = `
      <input type="text" placeholder="Attribute name (e.g., price)" aria-label="Attribute name"
             data-i18n-placeholder="attrNamePlaceholder" data-i18n-placeholder-en="Attribute name (e.g., price)"
             data-i18n-aria-label="attrName" data-i18n-aria-label-en="Attribute name"
             class="attribute-name flex-1 shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-1 focus:ring-indigo-400">
      <select class="attribute-type flex-none w-full sm:w-auto py-2 px-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-400" aria-label="Attribute type"
              data-i18n-aria-label="attrType" data-i18n-aria-label-en="Attribute type">
        <option value="String" data-i18n="typeString" data-i18n-en="String">String</option>
        <option value="Number" data-i18n="typeNumber" data-i18n-en="Number">Number</option>
        <option value="Boolean" data-i18n="typeBoolean" data-i18n-en="Boolean">Boolean</option>
        <option value="Date" data-i18n="typeDate" data-i18n-en="Date">Date</option>
      </select>
      <label class="flex items-center text-gray-700 text-sm">
        <input type="checkbox" class="attribute-required form-checkbox h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500 mr-2"><span data-i18n="required" data-i18n-en="Required">Required</span>
      </label>
      <button type="button" class="remove-attribute-btn flex-none bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded-lg shadow-sm transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              data-i18n="remove" data-i18n-en="Remove">Remove</button>`;
    row.querySelector('.attribute-name').value = name;
    row.querySelector('.attribute-type').value = type;
    row.querySelector('.attribute-required').checked = required;
    row.querySelector('.remove-attribute-btn').addEventListener('click', () => row.remove());
    attributesContainer.appendChild(row);
    applyI18n(row);
  }

  function mode() { return document.querySelector('input[name="dbMode"]:checked').value; }
  function showMode() {
    const m = mode();
    $('atlasFields').hidden = m !== 'atlas';
    $('uriFields').hidden = m !== 'uri';
    $('databaseField').hidden = m === 'uri';
  }

  function spec() {
    return {
      model: $('modelName').value,
      plural: $('pluralName').value,
      port: $('port').value,
      routeStyle: $('routeStyle').value,
      timestamps: $('timestamps').checked,
      connection: { mode: mode(), user: $('mongoUserId').value, password: $('mongoPassword').value, host: $('mongoUri').value,
        database: $('mongoDatabaseName').value, uri: $('mongoFullUri').value },
      attributes: [...attributesContainer.querySelectorAll('.attribute-row')].map(r => ({
        name: r.querySelector('.attribute-name').value, type: r.querySelector('.attribute-type').value,
        required: r.querySelector('.attribute-required').checked }))
    };
  }

  const esc = t => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const METHOD_COLOUR = { GET: 'bg-green-600', POST: 'bg-amber-600', PUT: 'bg-blue-700', DELETE: 'bg-red-600' };
  function renderTabs() {
    $('fileTabs').innerHTML = Object.keys(project.files).map(f =>
      `<button type="button" class="file-tab" role="tab" data-file="${esc(f)}">${esc(f)}</button>`).join('');
    document.querySelectorAll('.file-tab').forEach(t => t.addEventListener('click', () => showFile(t.dataset.file)));
    if (!project.files[current]) current = 'server.js';
  }
  function renderTests() {
    const zh = locale === 'zh';
    $('testList').innerHTML = project.tests.map((t, i) => {
      const url = project.host + t.url.replace(/\{\{id\}\}/g, '<id>');
      const ok = t.expect < 300;
      const name = zh ? (t.nameZh || t.name) : t.name;
      const why = zh ? (t.whyZh || t.why) : t.why;
      return `<div class="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <div class="flex flex-wrap items-center gap-2 mb-1">
          <span class="text-gray-500 font-semibold">${i + 1}.</span>
          <span class="${METHOD_COLOUR[t.method]} text-white text-xs font-bold px-2 py-1 rounded">${t.method}</span>
          <code class="text-sm break-all">${esc(url)}</code>
          <span class="ml-auto text-xs font-bold px-2 py-1 rounded ${ok ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">${zh ? I18N.expect : 'expect'} ${t.expect}</span>
        </div>
        <p class="text-sm text-gray-700"><strong>${esc(name)}.</strong> ${esc(why)}</p>
        ${t.body ? `<pre class="mt-2 text-sm bg-white border border-gray-200 rounded p-2 overflow-x-auto">${esc(JSON.stringify(t.body, null, 2))}</pre>` : ''}
      </div>`;
    }).join('');
    $('sampleUrl').textContent = project.createUrl;
    $('sampleList').innerHTML = project.samples.map((r, i) => `<div class="bg-white border border-gray-200 rounded-lg">
        <div class="flex items-center justify-between px-3 py-1.5 border-b border-gray-200 text-sm text-gray-600">
          <span>${zh ? I18N.sample : 'Sample'} ${i + 1}</span>
          <button type="button" class="copy-sample text-indigo-600 hover:text-indigo-800 font-semibold" data-i="${i}">${zh ? I18N.copy : 'Copy'}</button>
        </div>
        <pre class="text-sm p-3 overflow-x-auto">${esc(JSON.stringify(r, null, 2))}</pre>
      </div>`).join('');
    document.querySelectorAll('.copy-sample').forEach(b => b.addEventListener('click', async () => {
      const text = JSON.stringify(project.samples[+b.dataset.i], null, 2);
      try { await navigator.clipboard.writeText(text); } catch (e) {
        const t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove();
      }
      b.textContent = zh ? I18N.copied : 'Copied';
      setTimeout(() => { b.textContent = zh ? I18N.copy : 'Copy'; }, 1500);
    }));
    $('testSection').hidden = false;
  }

  function showFile(name) {
    current = name;
    output.value = project ? project.files[name] : '';
    document.querySelectorAll('.file-tab').forEach(t => {
      const on = t.dataset.file === name;
      t.setAttribute('aria-selected', on);
      t.className = 'file-tab px-3 py-1.5 rounded-t-lg text-sm font-mono border border-b-0 ' + (on ? 'bg-gray-50 text-indigo-700 font-semibold border-gray-300' : 'bg-white text-gray-600 border-transparent hover:text-indigo-600');
    });
  }

  $('modelName').addEventListener('input', () => {
    if (!pluralTouched) { const p = ApiGen.pascal($('modelName').value); $('pluralName').value = p ? ApiGen.pluralize(p.charAt(0).toLowerCase() + p.slice(1)).toLowerCase() : ''; }
    pluralHint();
  });
  $('pluralName').addEventListener('input', () => { pluralTouched = $('pluralName').value.trim() !== ''; pluralHint(); });
  function pluralHint() {
    const p = $('pluralName').value.trim().toLowerCase();
    if (locale === 'zh') {
      const show = p ? I18N.pluralHintFilled.replace(/\{p\}/g, esc(p)) : I18N.pluralHintEmpty;
      $('pluralHint').innerHTML = I18N.pluralHintPrefix + show + '。';
    } else {
      const show = p ? '<code>/api/' + esc(p) + '</code> and the collection <code>' + esc(p) + '</code>' : 'the URL <code>/api/&lt;plural&gt;</code> and as the collection name';
      $('pluralHint').innerHTML = 'Filled in for you; change it if needed. Used in ' + show + '.';
    }
  }
  document.querySelectorAll('input[name="dbMode"]').forEach(r => r.addEventListener('change', showMode));
  $('addAttributeBtn').addEventListener('click', () => addAttributeRow());

  $('generateCodeBtn').addEventListener('click', () => {
    const r = ApiGen.build(spec());
    if (r.errors.length) { showMessage(r.errors.map(translateText).join('\n'), 'error', true); return; }
    project = r;
    $('outputSection').hidden = false;
    renderTabs();
    showFile(current);
    renderTests();
    showMessage('Project generated: ' + Object.keys(r.files).length + ' files. Download it as a .zip, or copy the files one by one. How to test it is below.');
  });

  $('copyCodeBtn').addEventListener('click', async () => {
    if (!project) return;
    try { await navigator.clipboard.writeText(output.value); }
    catch (e) { output.select(); document.execCommand('copy'); }
    showMessage(current + ' copied to the clipboard.');
  });

  $('downloadZipBtn').addEventListener('click', async () => {
    if (!project) return;
    if (typeof JSZip === 'undefined') { showMessage('The .zip library did not load: copy the files one by one instead.', 'error'); return; }
    const zip = new JSZip();
    const dir = zip.folder(project.folder);
    for (const [name, text] of Object.entries(project.files)) dir.file(name, text);
    const blob = await zip.generateAsync({ type: 'blob' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = project.folder + '.zip';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    showMessage('Downloaded ' + project.folder + '.zip. Unzip it, then run npm install and npm run dev.');
  });

  $('langToggleBtn').addEventListener('click', toggleLang);

  document.addEventListener('DOMContentLoaded', () => {
    applyI18n(document);
    pluralHint();
    addAttributeRow();
    showMode();
  });
  applyI18n(document);
  pluralHint();
}
