import React from 'react';
import CalendarContainer from '@/presentation/features/Calendar/containers/CalendarContainer';
import { useAuthUser, useAuthActions } from '@/application/stores/authStore';
import { Button } from '@/presentation/components/ui/button';
import { LogOut } from 'lucide-react';
import { useLogoutMutation } from '@/application/view-models/useAuthVM';
import { Separator } from '@/presentation/components/ui/separator';

const HomePage: React.FC = () => {
  const user = useAuthUser();
  const actions = useAuthActions();
  const logoutMutation = useLogoutMutation();
  
  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      actions.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Calendar</h1>
          <p className="text-gray-600">Manage your events and schedule</p>
        </div>
        
        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center">
              <div className="mr-3 text-right">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
              )}
            </div>
          )}
          
          <Button 
            variant="outline"
            onClick={handleLogout}
            disabled={logoutMutation.isLoading}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
      
      <Separator className="my-4" />
      
      <div className="flex-1">
        <CalendarContainer />
      </div>
    </div>
  );
};

export default HomePage;