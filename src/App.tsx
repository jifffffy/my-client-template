import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/presentation/components/ui/sonner';
import AuthPage from '@/presentation/pages/AuthPage';
import HomePage from '@/presentation/pages/HomePage';

import ProtectedRoute from '@/presentation/pages/ProtectedRoute';
import MainLayout from './presentation/components/layout/MainLayout';

// 创建React Query客户端
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5分钟
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* 公开路由 */}
          <Route path="/auth" element={<AuthPage />} />
          
          {/* 需要认证的路由 */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
            </Route>
          </Route>
          
          {/* 默认重定向 */}
          <Route path="*" element={<Navigate to="/" replace/>} />
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
};

export default App;