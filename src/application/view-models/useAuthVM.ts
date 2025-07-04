import { 
  login, 
  register, 
  logout, 
  getCurrentUser 
} from '@/application/services/authService';
import type {
  LoginCredentials,
  RegisterCredentials
} from '@/domain/entities/User';
import { useAuthActions, useAuthError, useAuthLoading, useAuthToken, useAuthUser } from '@/application/stores/authStore';

export const useLoginMutation = () => {
  const actions = useAuthActions();
  
  return {
    mutateAsync: async (credentials: LoginCredentials) => {
      try {
        actions.setLoading(true);
        actions.setError(null);
        
        const response = await login(credentials);
        actions.setUser(response.user);
        actions.setToken(response.token);
        
        return response;
      } catch (error: any) {
        actions.setError(error.message || 'Login failed');
        throw error;
      } finally {
        actions.setLoading(false);
      }
    },
    isPending: useAuthLoading(),
    error: useAuthError(),
  };
};

export const useRegisterMutation = () => {
  const actions = useAuthActions();
  
  return {
    mutateAsync: async (credentials: RegisterCredentials) => {
      try {
        actions.setLoading(true);
        actions.setError(null);
        
        const response = await register(credentials);
        
        actions.setUser(response.user);
        actions.setToken(response.token);
        
        return response;
      } catch (error: any) {
        actions.setError(error.message || 'Registration failed');
        throw error;
      } finally {
        actions.setLoading(false);
      }
    },
    isPending: useAuthLoading(),
    error: useAuthError(),
  };
};

export const useLogoutMutation = () => {
  const actions = useAuthActions();
  
  return {
    mutateAsync: async () => {
      try {
        actions.setLoading(true);
        await logout();
        actions.logout();
      } catch (error: any) {
        actions.setError(error.message || 'Logout failed');
        throw error;
      } finally {
        actions.setLoading(false);
      }
    },
    isPending: useAuthLoading(),
    error: useAuthError(),
  };
};

export const useCurrentUserQuery = () => {
  const token = useAuthToken();
  const actions = useAuthActions();
  
  return {
    data: useAuthUser(),
    isPending: useAuthLoading(),
    error: useAuthError(),
    refetch: async () => {
      if (!token) return null;
      
      try {
        actions.setLoading(true);
        const user = await getCurrentUser();
        actions.setUser(user);
        return user;
      } catch (error: any) {
        actions.setError(error.message || 'Failed to fetch user');
        throw error;
      } finally {
        actions.setLoading(false);
      }
    }
  };
};