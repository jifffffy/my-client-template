# API 参考

模拟后端提供以下 RESTful API 端点：

## 认证 API

### 注册用户

- **端点**: `POST /auth/register`
- **请求体**:

  ````json
  {
    "name": "用户名",
    "email": "user@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }

  响应：
  ```json
  {
  "user": {
    "id": 1,
    "name": "用户名",
    "email": "user@example.com",
    "avatar": "https://..."
  },
  "token": "jwt.token.here"
  }
  ````

用户登录
端点: POST /auth/login

请求体:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

日历事件 API
获取所有事件
端点: GET /events

响应:

```json
[
  {
    "id": 1,
    "title": "团队会议",
    "description": "每周团队会议",
    "start": "2023-10-01T10:00:00.000Z",
    "end": "2023-10-01T11:00:00.000Z",
    "allDay": false,
    "color": "blue",
    "label": "工作",
    "location": "会议室A"
  }
]
```

创建事件
端点: POST /events

请求体:

```json
{
  "title": "新事件",
  "start": "2023-10-02T14:00:00.000Z",
  "end": "2023-10-02T15:00:00.000Z",
  "color": "green"
}
```
响应: 创建的事件对象
更新事件
端点: PUT /events/:id

请求体: 要更新的字段

响应: 更新后的事件对象

删除事件
端点: DELETE /events/:id

响应: 204 No Content

请求头
所有需要认证的请求需包含：
```bash
Authorization: Bearer <token>
```

### 状态码
状态码	含义
200	成功
201	创建成功
400	请求错误
401	未认证
404	资源不存在
500	服务器内部错误
