"use client"
import { Bell } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ClubHeadsSection from '../clubHeadSection/ClubHeadsSection';
import EventStats from './EventStats';
import ImageSlider from './ImageSlider';
import SupportResources from './SupportResources';
import UpcomingEventsList from './UpcomingEventsList';

const BACKGROUND_IMAGE = '/image/image.png';

const DashboardPage = () => {
  const router = useRouter();
  const [eventCounts, setEventCounts] = useState({ sports: 0, cultural: 0, technical: 0 });
  const [upcomingEvents, setUpcomingEvents] = useState({ sports: [], cultural: [], technical: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = localStorage.getItem("user");  
  const userData = JSON.parse(user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const eventsResponse = await fetch('http://localhost:5000/api/events', {
          credentials: 'include',
        });
        const eventsData = await eventsResponse.json();
        const counts = { sports: 0, cultural: 0, technical: 0 };

        eventsData.forEach(event => {
          if (event.clubId && event.clubId.category) {
            const category = event.clubId.category.toLowerCase();
            let mappedCategory = category;
            if (category === 'sport' || category === 'sports') mappedCategory = 'sports';
            if (category === 'culture' || category === 'cultural') mappedCategory = 'cultural';
            if (category === 'tech' || category === 'technology') mappedCategory = 'technical';
            if (counts.hasOwnProperty(mappedCategory)) counts[mappedCategory]++;
          }
        });

        setEventCounts(counts);

        const categories = ['sports', 'cultural', 'technical'];
        const upcomingEventsData = {};
        for (const category of categories) {
          const clubsResponse = await fetch(`http://localhost:5000/api/clubs?category=${category}`, {
            credentials: 'include',
          });
          const clubsData = await clubsResponse.json();
          if (clubsData.length > 0) {
            const clubId = clubsData[0]._id;
            const upcomingResponse = await fetch(`http://localhost:5000/api/events/upcoming/${clubId}`, {
              credentials: 'include',
            });
            const upcomingData = await upcomingResponse.json();
            upcomingEventsData[category] = upcomingData;
          } else {
            upcomingEventsData[category] = [];
          }
        }

        setUpcomingEvents(upcomingEventsData);
      } catch (err) {
        setError('Failed to fetch dashboard data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  

  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <div className="flex items-center">
              <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/notifications" className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
              </Link>
              <div className="md:hidden">
                <span className="font-medium text-sm text-gray-700">{user?.name || "Student"}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content area with scroll */}
        <main className="flex-1 overflow-auto bg-gray-50 p-4 sm:p-6">
          {/* Welcome banner */}
          <div className="relative mb-6 rounded-xl overflow-hidden">
            <div className="h-48 relative">
              <Image src={BACKGROUND_IMAGE} alt="Dashboard Background" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/40" />
              <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Welcome to Your Campus Portal</h1>
                <p className="text-blue-100 max-w-lg">Stay updated with upcoming events, manage your academic resources, and connect with clubs and activities.</p>
              </div>
            </div>
          </div>
          <div className='mt-4'>
            <ImageSlider upcomingEvents={upcomingEvents} />
          </div>
          <div className='my-4'>
      {(userData?.role === 'admin' || userData?.role === 'clubhead') && (
        <ClubHeadsSection />
      )}
    </div>

         
         
          <div className="grid grid-cols-2 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-4 h-full">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">Event Statistics</h2>
                <EventStats eventCounts={eventCounts} isLoading={isLoading} />
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-4 h-full">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">Upcoming Events</h2>
                <UpcomingEventsList upcomingEvents={upcomingEvents} isLoading={isLoading} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Academic Calendar</h2>
              <div className="border rounded p-4 text-center text-gray-500 min-h-32">
                <p>Academic calendar information will appear here</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Campus Resources</h2>
              <SupportResources />
            </div>
          </div>

          <div className="mt-6 bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Campus Announcements</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <h3 className="font-medium text-gray-800">Semester Registration Open</h3>
                <p className="text-sm text-gray-600">Registration for next semester courses is now open. Please complete your course selection by April 15.</p>
                <p className="text-xs text-gray-500 mt-1">Posted 2 days ago</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4 py-2">
                <h3 className="font-medium text-gray-800">Library Extended Hours</h3>
                <p className="text-sm text-gray-600">The main library will extend operating hours during finals week. Open until midnight starting April 10.</p>
                <p className="text-xs text-gray-500 mt-1">Posted 3 days ago</p>
              </div>
            </div>
          </div>

          <footer className="mt-8 text-center text-sm text-gray-500 py-4">
            <p>© {new Date().getFullYear()} College Management System. All rights reserved.</p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;