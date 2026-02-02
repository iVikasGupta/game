import { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  Factory,
  LayoutDashboard,
  FileText,
  Send,
  BarChart3,
  TrendingUp,
  BookOpen,
  LogOut,
  Trophy
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { userProfile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/submit-decision', icon: Send, label: 'Submit Decision' },
    { to: '/results', icon: FileText, label: 'Results' },
    { to: '/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/cost-curves', icon: TrendingUp, label: 'Cost Curves' },
    { to: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
    { to: '/guide', icon: BookOpen, label: 'Strategy Guide' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-blue-900 text-white flex flex-col">
        <div className="p-6 border-b border-blue-800">
          <div className="flex items-center space-x-3">
            <Factory className="w-8 h-8 text-orange-500" />
            <div>
              <h1 className="text-xl font-bold">Factory Manager</h1>
              <p className="text-xs text-blue-300">{userProfile?.role === 'instructor' ? 'Instructor' : 'Student'} Portal</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-blue-800">
          <div className="text-sm">
            <div className="font-semibold">{userProfile?.full_name}</div>
            <div className="text-blue-300 text-xs">{userProfile?.email}</div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition-colors"
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-blue-800">
          <button
            onClick={handleSignOut}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition-colors w-full text-left"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};
