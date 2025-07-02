import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '@/presentation/components/auth/LoginForm';
import RegisterForm from '@/presentation/components/auth/RegisterForm';
import { useCurrentUserQuery } from '@/application/view-models/useAuthVM';
import { useAuthUser } from '@/application/stores/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';

const AuthPage: React.FC = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const navigate = useNavigate();
  const user = useAuthUser();
  
  // 检查当前用户状态
  const { isLoading } = useCurrentUserQuery();
  
  // 如果用户已登录，重定向到主页
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSuccess = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Calendar App
            </CardTitle>
            <p className="text-gray-600 mt-2">
              {isLoginView 
                ? 'Sign in to access your calendar' 
                : 'Create an account to get started'}
            </p>
          </CardHeader>
          <CardContent>
            {isLoginView ? (
              <LoginForm 
                onSuccess={handleSuccess}
                onSwitchToRegister={() => setIsLoginView(false)}
              />
            ) : (
              <RegisterForm 
                onSuccess={handleSuccess}
                onSwitchToLogin={() => setIsLoginView(true)}
              />
            )}
          </CardContent>
        </Card>
        
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} Calendar App. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;