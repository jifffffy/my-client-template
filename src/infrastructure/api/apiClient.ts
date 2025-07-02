import axios from 'axios';

// 模拟API延迟
const simulateDelay = () => new Promise(resolve => setTimeout(resolve, 500));

// 创建API客户端实例
const apiClient = axios.create({
  baseURL: 'https://your-api-endpoint.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
apiClient.interceptors.request.use(async (config) => {
  // 在这里添加认证token等
  await simulateDelay();
  return config;
});

// 响应拦截器
apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default apiClient;