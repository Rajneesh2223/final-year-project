"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Bell, Calendar } from 'lucide-react';
import ImageSlider from '../components/dashboard/ImageSlider';
import EventStats from '../components/dashboard/EventStats';
import SupportResources from '../components/dashboard/SupportResources';
import UpcomingEventsList from '../components/dashboard/UpcomingEventsList';
import { useSelector } from 'react-redux';  
const BACKGROUND_IMAGE = '/image/image.png';

const DashboardPage = () => {
  const router = useRouter();
  const [eventCounts, setEventCounts] = useState({ sports: 0, cultural: 0, technical: 0 });
  const [upcomingEvents, setUpcomingEvents] = useState({ sports: [], cultural: [], technical: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.auth.user);
  console.log("user",user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const eventsResponse = await fetch('http://localhost:5000/api/events',{
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
          const clubsResponse = await fetch(`http://localhost:5000/api/clubs?category=${category}`,{
            credentials: 'include',
          });
          const clubsData = await clubsResponse.json();
          if (clubsData.length > 0) {
            const clubId = clubsData[0]._id;
            const upcomingResponse = await fetch(`http://localhost:5000/api/events/upcoming/${clubId}`,{
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
    <div className="relative h-full">
      <div className="absolute inset-0 z-0">
        <Image src={BACKGROUND_IMAGE} alt="Dashboard Background" fill sizes="100vw" className="rounded-md object-cover"  />
      </div>
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-blue-900/10 to-purple-900/20" />

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex justify-between items-center mb-8 bg-white/90 rounded-xl shadow-lg p-4 sm:p-6 backdrop-blur-sm">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">College Management System</h1>
          <Link href="/notifications" className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
            <Bell className="h-6 w-6 text-gray-600" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
          </Link>
        </div>

        {error && <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md my-4 text-red-700">{error}</div>}

        <div className="mb-8 relative z-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">Upcoming Events</h2>
          <ImageSlider upcomingEvents={upcomingEvents} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <UpcomingEventsList upcomingEvents={upcomingEvents} isLoading={isLoading} />
          <SupportResources />
        </div>

        <div className="mt-12 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} College Management System. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;