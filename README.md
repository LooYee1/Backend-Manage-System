以下是已经按照Markdown格式编写的内容，它已经符合你之前要求的Markdown格式，如果你有特定的修改需求，比如内容上的调整、格式细节的修改等，请随时告诉我。

# React 新闻管理系统项目

## 一、项目简介
本项目是一个基于 React 的新闻管理系统，集成了用户管理、权限管理、新闻发布与审核等功能。它使用了 React 18 及 React Router v6 等技术，结合 Ant Design 组件库，提供了一个简洁易用的界面。同时，项目使用 JSON Server 作为后端模拟数据，方便开发和测试。

## 二、项目功能
### 1. 用户管理
- 不同角色（超级管理员、区域管理员、编辑）的用户登录和权限控制。
- 用户列表展示，可按区域、角色名称等条件筛选。
- 用户状态（启用/禁用）的切换。
- 用户的添加、删除和更新操作。

### 2. 权限管理
- 角色列表展示，可对角色进行删除和权限编辑。
- 权限列表展示，可对权限进行删除和页面开关设置。

### 3. 新闻管理
- 新闻的添加、编辑和删除操作。
- 新闻草稿的保存和提交审核。
- 新闻的审核与驳回操作。
- 新闻的发布和撤销发布操作。
- 新闻的预览和详情展示。

### 4. 游客浏览
- 游客可以直接浏览新闻列表和详情。

## 三、项目结构
```
src
├── components
│   ├── sandbox
│   │   └── NewsRouter.js
│   └── user-manage
│       └── UserForm.js
├── router
│   └── IndexRouter.js
├── store
│   └── store.js
├── util
│   └── http.js
├── views
│   ├── login
│   │   └── Login.js
│   ├── news
│   │   ├── Detail.js
│   │   └── News.js
│   └── sandbox
│       ├── audit-manage
│       │   ├── Audit.js
│       │   └── AuditList.js
│       ├── home
│       │   └── Home.js
│       ├── news-manage
│       │   ├── NewsAdd.js
│       │   ├── NewsDraft.js
│       │   ├── NewsCategory.js
│       │   ├── NewsPreview.js
│       │   └── NewsUpdate.js
│       ├── nopermission
│       │   └── Nopermission.js
│       ├── publish-manage
│       │   ├── Unpublished.js
│       │   ├── Published.js
│       │   └── Sunset.js
│       ├── right-manage
│       │   ├── RoleList.js
│       │   └── RightList.js
│       └── user-manage
│           └── UserList.js
├── App.js
├── App.test.js
├── index.css
└── index.js
```

## 四、技术栈
- **前端框架**：React 18
- **路由管理**：React Router v6
- **状态管理**：Redux
- **组件库**：Ant Design
- **数据模拟**：JSON Server
- **日期处理**：Moment.js

## 五、环境准备
- **Node.js**：确保已经安装 Node.js（推荐版本 14.x 及以上）。
- **npm 或 yarn**：用于安装项目依赖。

## 六、安装与运行
### 1. 克隆项目
```bash
git clone [项目仓库地址]
cd [项目目录]
```

### 2. 安装依赖
```bash
npm install
# 或者使用 yarn
yarn install
```

### 3. 启动 JSON Server
```bash
npx json-server --watch db.json --port 8000
```

### 4. 启动前端项目
```bash
npm start
# 或者使用 yarn
yarn start
```

### 5. 访问项目
打开浏览器，访问 `http://localhost:3000`。

## 七、配置说明
### 1. 后端接口地址
项目使用 JSON Server 模拟后端接口，接口地址为 `http://localhost:8000`。如果需要修改后端地址，可以在 `src/util/http.js` 中进行配置。

### 2. 路由配置
路由配置文件为 `src/router/IndexRouter.js` 和 `src/components/sandbox/NewsRouter.js`，可以根据需要修改路由规则。

### 3. 权限配置
权限信息存储在 `localStorage` 中，根据用户角色动态显示不同的路由和操作按钮。可以在 `src/components/sandbox/NewsRouter.js` 中修改权限验证逻辑。

## 八、注意事项
- 项目使用 JSON Server 模拟后端数据，数据存储在 `db.json` 文件中。在开发过程中，对数据的修改会直接影响该文件。
- 项目中的用户登录信息存储在 `localStorage` 中，在实际生产环境中需要使用更安全的方式进行存储和验证。

## 九、贡献指南
如果你想为项目做出贡献，可以按照以下步骤进行：
1. Fork 项目仓库。
2. 创建新的分支：`git checkout -b feature/your-feature`。
3. 提交代码并推送：`git push origin feature/your-feature`。
4. 提交 Pull Request。

## 十、许可证
本项目采用 [MIT 许可证](LICENSE)。