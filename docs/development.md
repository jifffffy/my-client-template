
### 8. 开发指南

# 开发指南

## 开发环境设置

1. 安装 Node.js 18+ 和 npm
2. 克隆仓库：`git clone https://github.com/yourusername/calendar-app.git`
3. 安装依赖：`npm install`
4. 启动开发服务器：`npm run dev`
5. 启动模拟后端：`npm run mock-server`

## 代码规范

### 命名约定
- 组件：`PascalCase` (如 `CalendarGrid.tsx`)
- 函数/变量：`camelCase`
- 常量：`UPPER_CASE`
- 接口：`PascalCase` (如 `CalendarEvent`)

### 文件结构
- 每个功能模块包含：
  - `components/`：展示组件
  - `containers/`：容器组件
  - `hooks/`：自定义 Hooks
  - `services/`：API 服务

## 添加新功能

### 示例：添加周视图
1. 在 `presentation/components/Calendar` 创建 `WeekView.tsx`
2. 在 `application/stores/calendarStore.ts` 添加视图状态
3. 在 `application/view-models/useCalendarVM.ts` 添加数据逻辑
4. 在 `presentation/features/Calendar/views` 创建容器组件
5. 更新路由和导航

## 测试策略

### 单元测试
```bash
npm test # 使用 Vitest 运行测试

### 测试示例
```typescript
// dateUtils.test.ts
import { getMonthDays, isSameDate } from '@/infrastructure/utils/dateUtils';

describe('dateUtils', () => {
  test('getMonthDays returns correct days', () => {
    const days = getMonthDays(new Date(2023, 9, 1)); // October 2023
    expect(days.length).toBe(35); // 5 weeks
  });
  
  test('isSameDate correctly compares dates', () => {
    const date1 = new Date(2023, 9, 15);
    const date2 = new Date(2023, 9, 15);
    expect(isSameDate(date1, date2)).toBe(true);
  });
});
```