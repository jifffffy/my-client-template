import React from 'react';
import { Calendar, Settings, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuthUser } from '@/application/stores/authStore';

const Sidebar: React.FC = () => {
  const user = useAuthUser();
  
  return (
    <div className="w-64 bg-white border-r flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold">Calendar App</h1>
      </div>
      
      <div className="flex-1 p-4">
        <nav className="space-y-1">
          <NavLink
            to="/"
            className={({ isActive }) => 
              `flex items-center px-4 py-2 rounded-lg ${
                isActive 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <Calendar className="mr-3 h-5 w-5" />
            <span>Calendar</span>
          </NavLink>
          
          <NavLink
            to="/profile"
            className={({ isActive }) => 
              `flex items-center px-4 py-2 rounded-lg ${
                isActive 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <User className="mr-3 h-5 w-5" />
            <span>Profile</span>
          </NavLink>
          
          <NavLink
            to="/settings"
            className={({ isActive }) => 
              `flex items-center px-4 py-2 rounded-lg ${
                isActive 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <Settings className="mr-3 h-5 w-5" />
            <span>Settings</span>
          </NavLink>
        </nav>
      </div>
      
      {user && (
        <div className="p-4 border-t flex items-center">
          {user.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-10 h-10 rounded-full mr-3"
            />
          ) : (
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10 mr-3" />
          )}
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;