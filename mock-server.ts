import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  avatar: string;
}

interface CalendarEvent {
  id: number;
  title: string;
  description?: string;
  start: string;
  end?: string;
  allDay?: boolean;
  color?: string;
  label?: string;
  location?: string;
}

interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// 模拟数据库
const users: User[] = [];
const events: CalendarEvent[] = [];
let idCounter = 100;

// 用户模型
class UserImpl implements User {
  id: number;
  name: string;
  email: string;
  password: string;
  avatar: string;

  constructor(id: number, name: string, email: string, password: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
  }
}

// 事件模型
class CalendarEventImpl implements CalendarEvent {
  id: number;
  title: string;
  description?: string;
  start: string;
  end?: string;
  allDay?: boolean;
  color?: string;
  label?: string;
  location?: string;

  constructor(
    id: number,
    title: string,
    description: string | undefined,
    start: string,
    end: string | undefined,
    allDay: boolean | undefined,
    color: string | undefined,
    label: string | undefined,
    location: string | undefined
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.start = start;
    this.end = end;
    this.allDay = allDay || false;
    this.color = color || 'blue';
    this.label = label;
    this.location = location;
  }
}

// 初始化一些测试数据
function initializeTestData() {
  // 添加测试用户
  const hashedPassword = bcrypt.hashSync('password123', 8);
  users.push(new UserImpl(1, 'Test User', 'test@example.com', hashedPassword));
  
  // 添加测试事件
  const now = new Date();
  events.push(new CalendarEventImpl(
    1, 
    'Team Meeting', 
    'Weekly team sync', 
    new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0).toISOString(),
    new Date(now.getFullYear(), now.getMonth(), now.getDate(), 11, 0).toISOString(),
    false,
    'blue',
    'Work',
    'Conference Room A'
  ));
  
  events.push(new CalendarEventImpl(
    2, 
    'Lunch with Alex', 
    'Discuss project details', 
    new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0).toISOString(),
    new Date(now.getFullYear(), now.getMonth(), now.getDate(), 13, 0).toISOString(),
    false,
    'emerald',
    'Personal',
    'Downtown Cafe'
  ));
  
  events.push(new CalendarEventImpl(
    3, 
    'Doctor Appointment', 
    'Annual checkup', 
    new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 14, 0).toISOString(),
    undefined,
    false,
    'rose',
    'Health',
    'Medical Center'
  ));
}

initializeTestData();

// JWT 密钥
const JWT_SECRET = 'your-secret-key-here';

// 生成 JWT token
function generateToken(user: User): string {
  return jwt.sign(
    { id: user.id, email: user.email }, 
    JWT_SECRET, 
    { expiresIn: '1h' }
  );
}

// 认证中间件
function authenticateToken(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.sendStatus(401);
  
  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(401);
    req.user = user;
    next();
  });
}

// 用户注册
app.post('/auth/register', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body as RegisterCredentials;
  
  // 验证输入
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }
  
  // 检查邮箱是否已注册
  if (users.some(user => user.email === email)) {
    return res.status(400).json({ message: 'Email already registered' });
  }
  
  try {
    // 创建新用户
    const hashedPassword = await bcrypt.hash(password, 8);
    const newUser = new UserImpl(++idCounter, name, email, hashedPassword);
    users.push(newUser);
    
    // 生成 token
    const token = generateToken(newUser);
    
    // 返回响应（不返回密码）
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({
      user: userWithoutPassword,
      token
    } as AuthResponse);
  } catch (error) {
    res.status(500).json({ message: 'Registration failed' });
  }
});

// 用户登录
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body as LoginCredentials;
  // 查找用户
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }
  
  try {
    // 验证密码
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // 生成 token
    const token = generateToken(user);
    
    // 返回响应（不返回密码）
    const { password: _, ...userWithoutPassword } = user;
    console.log("login success", JSON.stringify(userWithoutPassword, null, 2));
    res.json({
      user: userWithoutPassword,
      token
    } as AuthResponse);
  } catch (error) {
    res.status(500).json({ message: 'Login failed' });
  }
});

// 获取当前用户信息
app.get('/auth/me', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.sendStatus(404);
  
  // 返回用户信息（不返回密码）
  const { password, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// 获取所有事件
app.get('/events', authenticateToken, (req, res) => {
  // 在实际应用中，这里应该按用户过滤事件
  res.json(events);
});

// 创建新事件
app.post('/events', authenticateToken, (req, res) => {
  const { title, description, start, end, allDay, color, label, location } = req.body;
  
  // 验证输入
  if (!title || !start) {
    return res.status(400).json({ message: 'Title and start time are required' });
  }
  
  // 创建新事件
  const newEvent = new CalendarEventImpl(
    ++idCounter,
    title,
    description,
    new Date(start).toISOString(),
    end ? new Date(end).toISOString() : undefined,
    allDay,
    color,
    label,
    location
  );
  
  events.push(newEvent);
  res.status(201).json(newEvent);
});

// 更新事件
app.put('/events/:id', authenticateToken, (req, res) => {
  const eventId = parseInt(req.params.id);
  const eventIndex = events.findIndex(e => e.id === eventId);
  
  if (eventIndex === -1) {
    return res.status(404).json({ message: 'Event not found' });
  }
  
  const { title, description, start, end, allDay, color, label, location } = req.body;
  
  // 更新事件
  const updatedEvent = {
    ...events[eventIndex],
    title: title || events[eventIndex].title,
    description: description !== undefined ? description : events[eventIndex].description,
    start: start ? new Date(start).toISOString() : events[eventIndex].start,
    end: end !== undefined ? (end ? new Date(end).toISOString() : undefined) : events[eventIndex].end,
    allDay: allDay !== undefined ? allDay : events[eventIndex].allDay,
    color: color || events[eventIndex].color,
    label: label || events[eventIndex].label,
    location: location || events[eventIndex].location,
  };
  
  events[eventIndex] = updatedEvent;
  res.json(updatedEvent);
});

// 删除事件
app.delete('/events/:id', authenticateToken, (req, res) => {
  const eventId = parseInt(req.params.id);
  const eventIndex = events.findIndex(e => e.id === eventId);
  
  if (eventIndex === -1) {
    return res.status(404).json({ message: 'Event not found' });
  }
  
  events.splice(eventIndex, 1);
  res.sendStatus(204);
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Mock API server running on http://localhost:${PORT}`);
  console.log('Endpoints:');
  console.log(`  POST   /auth/register`);
  console.log(`  POST   /auth/login`);
  console.log(`  GET    /auth/me`);
  console.log(`  GET    /events`);
  console.log(`  POST   /events`);
  console.log(`  PUT    /events/:id`);
  console.log(`  DELETE /events/:id`);
});