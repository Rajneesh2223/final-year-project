import {
  BarChart, Bell, CalendarDays,
  GraduationCap,
  Home,
  Lock,
  LogIn,
  LogOut,
  Settings,
  Shield,
  User,
  Users
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        
        const localUser = JSON.parse(localStorage.getItem('user'));
        if (localUser) {
          setUser(localUser);
          setLoading(false);
          return;
        }

        
        const response = await fetch('http://localhost:5000/api/auth/current-user', {
          credentials: 'include',
        });
        
        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('user', JSON.stringify(data));
          setUser(data);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  
  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      localStorage.removeItem('user');
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  
  const allMenuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard', roles: ['student', 'faculty', 'admin'] },
    { icon: CalendarDays, label: 'Events', path: '/events', roles: ['student', 'faculty', 'admin'] },
    { icon: Users, label: 'Clubs', path: '/clubs', roles: ['student', 'faculty', 'admin'] },
    { icon: BarChart, label: 'Analytics', path: '/analytics', roles: ['faculty', 'admin'] },
    { icon: Bell, label: 'Notifications', path: '/notifications', roles: ['student', 'faculty', 'admin'] },
    { icon: Settings, label: 'Settings', path: '/settings', roles: ['student', 'faculty', 'admin'] },
    { icon: User, label: 'Profile', path: '/profile', roles: ['student', 'faculty', 'admin'] },
    { icon: Shield, label: 'Admin Panel', path: '/admin', roles: ['admin'], badge: 'Admin Only' },
    { icon: Lock, label: 'Moderation', path: '/moderation', roles: ['faculty', 'admin'], badge: 'Staff' },
    
  ];

  
  const getFilteredMenuItems = () => {
    if (!user) {
      return [{ icon: LogIn, label: 'Login', path: '/login' }];
    }
    return allMenuItems.filter(item => 
      item.roles.includes(user.role?.toLowerCase())
    );
  };

  if (loading) {
    return (
      <div className="w-64 bg-white border-r border-gray-200 p-4 h-screen sticky top-0">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800 flex items-center">
          <span className="bg-blue-600 text-white p-2 rounded-lg mr-3">
            <GraduationCap className="h-5 w-5" />
          </span>
          CampusConnect
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {getFilteredMenuItems().map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <li key={item.label}>
                <Link
                  href={item.path}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className={`h-5 w-5 mr-3 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      item.badge === 'Admin Only' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-gray-200">
        {user ? (
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                {user.picture ? (
                  <img 
                    src={user.picture} 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="h-5 w-5 text-blue-600" />
                )}
              </div>
              <div>
              <p className={`font-medium text-sm  ${user.role === "admin" ? "bg-red-500/10 text-red-700" : "bg-blue-500/10 text-blue-500 font-semibold"} p-2 rounded-md`}>
  {user.name}
</p>
                <p className="text-xs text-gray-500 capitalize">
                  {user.role} {user.role === 'admin' && '⭐'}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center justify-center w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <LogIn className="h-4 w-4 mr-2" />
            Student Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;