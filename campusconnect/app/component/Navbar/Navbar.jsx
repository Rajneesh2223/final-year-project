import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  BarChart, 
  Bell, 
  CalendarDays, 
  Home, 
  LogIn, 
  Settings, 
  Users,
  GraduationCap, // Added missing import
  User // Added missing import
} from 'lucide-react';

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/current-user', {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
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

  const menuItems = [
    { icon: Home, label: 'Dashboard', to: '/dashboard', protected: true },
    { icon: CalendarDays, label: 'Events', to: '/events', protected: true },
    { icon: Users, label: 'Clubs', to: '/clubs', protected: true },
    { icon: BarChart, label: 'Analytics', to: '/analytics', protected: true },
    { icon: Bell, label: 'Notifications', to: '/notifications', protected: true },
    { icon: Settings, label: 'Settings', to: '/settings', protected: true },
    { icon: Users, label: 'Profile', to: '/user-profile', protected: true },
  ];

  if (!user) {
    menuItems.push({ icon: LogIn, label: 'Login', to: '/Login', protected: false });
  }

  if (loading) {
    return (
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
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
          {menuItems
            .filter((item) => !item.protected || user)
            .map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.to;
              return (
                <li key={item.label}>
                  <Link
                    href={item.to}
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-600 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className={`h-5 w-5 mr-3 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
        </ul>
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-gray-200">
        {user ? (
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-sm">{user.name}</p>
              <p className="text-xs text-gray-500">Student</p>
            </div>
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