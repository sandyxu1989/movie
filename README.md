# Movie App

基于 React + TypeScript + MUI 的电影搜索应用。
API 使用 TMDB 提供给个人的 key 获取。

## 功能

- 搜索电影：支持无限滚动和排序
- 电影详情：展示演员、预告片、导演、评论等信息
- 待看清单：收藏、排序、移除电影，支持随机抽选
- 响应式设计：适配不同屏幕尺寸
- 错误处理：统一的错误提示和网络错误处理
- 数据缓存：使用 localStorage 缓存 API 数据

## 技术栈

- React 18
- TypeScript
- Material-UI
- React Router
- Vite

## 开发

```bash
npm install
npm run dev
```

## 项目结构

- `src/api` - API 接口与 Adapter（数据防损坏）
- `src/features` - 业务页面
- `src/components` - 可复用 UI 组件
- `src/hooks` - 可复用逻辑（无限滚动、待看清单）
- `src/utils` - 工具函数
- `src/types` - 集中类型定义

## 设计理由

1. **使用 Adapter 模式**（`tmdb.ts` 内的 `normalize` 函数）防止 API 返回的对象/数组结构不稳定，确保数据转换的健壮性。
2. **Hooks 封装复用逻辑**：将无限滚动、待看清单等逻辑封装为自定义 Hooks，提升代码可维护性和复用性。
3. **组件化设计**：将 Card、Notice、EmptyState 等 UI 元素组件化，提升可扩展性和一致性。

## 效能优化

- **IntersectionObserver 实现无限滚动**：使用 `useInfiniteScroll` Hook 监听滚动位置，减少 DOM 操作负担，提升性能。
- **图片懒加载**：所有图片使用 `loading="lazy"` 属性，延迟加载非首屏图片，优化首屏加载速度。
- **排序使用 useMemo**：在 `SearchPage` 和 `WatchlistPage` 中使用 `useMemo` 缓存排序结果，避免不必要的重算。
- **按需加载列表**：详情页初始只显示前 5 位演员，提供"查看更多"按钮跳转到完整演员列表页面，减少初始渲染负担，提升 LCP（Largest Contentful Paint）性能。评论列表限制显示前 5 条。
