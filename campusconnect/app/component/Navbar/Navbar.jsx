import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { BarChart, Bell, CalendarDays, Home, LogIn, Settings, Users } from 'lucide-react';

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Prevent flicker

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/current-user', {
          method: 'GET',
          credentials: 'include', // Include cookies in request
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data); // Example: { id: 123, name: "John Doe" }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setUser(null);
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
    { icon: Users, label: 'User Profile', to: '/user-profile', protected: true },
  ];

  // Add Login only if no user is present
  if (!user) {
    menuItems.push({ icon: LogIn, label: 'Login', to: '/Login', protected: false });
  }

  if (loading) {
    return <div className="p-4 text-gray-500">Loading...</div>;
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">Campus Connect</h1>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1">
          {menuItems
            .filter((item) => !item.protected || user) // Show only if user is authenticated
            .map((item, index) => {
              const Icon = item.icon;
              const isActive = pathname === item.to;
              return (
                <li key={index}>
                  <Link
                    href={item.to}
                    className={`flex items-center px-4 py-3 transition-colors duration-200 ${
                      isActive
                        ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className={`h-5 w-5 mr-3 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
