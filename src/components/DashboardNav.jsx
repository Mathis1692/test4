import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User, 
  Calendar, 
  Settings, 
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/**
 * Dashboard navigation sidebar using React Router's NavLink
 * for automatic active state management
 */
const DashboardNav = () => {
  const { logout } = useAuth();
  
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg py-6 px-4 z-10">
      <div className="flex items-center mb-8">
        <div className="h-8 w-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold">C</div>
        <h1 className="ml-2 text-xl font-bold text-purple-600">Cirqle</h1>
      </div>
      
      <nav className="space-y-1">
        <NavItem to="/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" exact />
        <NavItem to="/settings/profile" icon={<User size={18} />} label="Profile Settings" />
        <NavItem to="/settings/calendar" icon={<Calendar size={18} />} label="Calendar Settings" />
        
        {/* Add more nav items as needed */}
        <div className="pt-4 mt-4 border-t border-gray-200">
          <button 
            onClick={logout}
            className="flex items-center w-full px-4 py-2.5 text-left text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <LogOut size={18} className="mr-3 text-gray-500" />
            <span>Sign Out</span>
          </button>
        </div>
      </nav>
    </aside>
  );
};

/**
 * NavItem component that leverages React Router's NavLink
 * for automatic active state highlighting
 */
const NavItem = ({ to, icon, label, exact = false }) => (
  <NavLink
    to={to}
    end={exact}
    className={({ isActive }) => `
      flex items-center px-4 py-2.5 rounded-lg transition-colors
      ${isActive 
        ? 'bg-purple-50 text-purple-700 font-medium' 
        : 'text-gray-700 hover:bg-gray-100'}
    `}
  >
    <span className={`mr-3 ${isActive ? 'text-purple-600' : 'text-gray-500'}`}>
      {icon}
    </span>
    <span>{label}</span>
  </NavLink>
);

export default DashboardNav;