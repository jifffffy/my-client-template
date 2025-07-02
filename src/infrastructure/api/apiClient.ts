import axios from "axios";

// 创建API客户端实例
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001", // 指向模拟服务器
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器 - 添加认证token
apiClient.interceptors.request.use(
  (config) => {
    // 直接从localStorage获取token
    const authStorage = localStorage.getItem("auth-storage");
    if (authStorage) {
      const authState = JSON.parse(authStorage);
      if (authState.state?.token) {
        config.headers.Authorization = `Bearer ${authState.state.token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);

    // 处理认证错误
    if (error.response?.status === 401) {
      // 清除认证状态
      localStorage.removeItem("auth-storage");
      window.location.reload();
    }

    return Promise.reject(error);
  }
);

export default apiClient;
