"use client"
import React from 'react';
import Link from 'next/link';
import { Calendar, Loader } from 'lucide-react';

const EmptyState = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-8">
    <Calendar className="h-16 w-16 text-gray-300 mb-4" />
    <p className="text-gray-500 text-center">{message}</p>
  </div>
);

const UpcomingEventsList = ({ upcomingEvents, isLoading }) => {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
      <div className="p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-black">Upcoming Events</h2>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader className="h-8 w-8 text-blue-500 animate-spin" />
            <span className="ml-2 text-black">Loading events...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(upcomingEvents).map(([category, events]) => (
              events.length > 0 && (
                <div key={category} className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 capitalize text-black border-b pb-2">
                    {category} Events
                  </h3>
                  <div className="space-y-3">
                    {events.map((event) => (
                      <Link 
                        href={`/events/${event._id}`}
                        key={event._id} 
                        className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className={`p-2 rounded-full ${
                          category === 'sports' ? 'bg-blue-100 text-blue-500' :
                          category === 'cultural' ? 'bg-green-100 text-green-500' :
                          'bg-purple-100 text-purple-500'
                        }`}>
                          <Calendar className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-black">{event.name}</p>
                          <p className="text-sm text-black">
                            {new Date(event.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )
            ))}
            {Object.values(upcomingEvents).every(events => events.length === 0) && (
              <EmptyState message="No upcoming events scheduled" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingEventsList; 