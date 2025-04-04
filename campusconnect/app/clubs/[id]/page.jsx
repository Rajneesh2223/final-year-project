'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';

import { Users, Calendar, MapPin, Mail } from 'lucide-react';
import { useSelector } from 'react-redux';



export default function ClubDetails() {
  const params = useParams();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joining, setJoining] = useState(false); 

  const user = localStorage.getItem("user");  
  const userData = JSON.parse(user);
  console.log("userData " , userData);
  const userId = userData._id;


  useEffect(() => {
    const fetchClubDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/clubs/${params.id}`,{
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch club details');
        }
        const data = await response.json();
        setClub(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClubDetails();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500 text-center">
          <h2 className="text-2xl font-bold mb-4">Club Not Found</h2>
          <p>The club you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }
 const handleJoinClub = async () => {
   if (!userId) {
     setError("You must be logged in to join a club.");
     return;
   }
  
   setJoining(true);
   try {
     const response = await fetch(`http://localhost:5000/api/joinClub/clubs/${params.id}/join`, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },  
       body: JSON.stringify({ userId:userId }),
     });
  
     if (!response.ok) {
       throw new Error('Failed to join club');
     }
  
   } catch (error) {
     setError(error.message);
   } finally {
     setJoining(false);
   }
 };
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Club Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="relative h-64">
            <Image
              src={club.coverImage || '/images/default-club-cover.jpg'}
              alt={club.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <h1 className="text-4xl font-bold text-white text-center">{club.name}</h1>
            </div>
          </div>
        </div>

        {/* Club Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">About</h2>
              <p className="text-gray-600">{club.description}</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
              {club.events && club.events.length > 0 ? (
                <div className="space-y-4">
                  {club.events.map((event) => (
                    <div key={event.id} className="border-b pb-4">
                      <h3 className="font-semibold text-lg">{event.title}</h3>
                      <p className="text-gray-600">{event.description}</p>
                      <div className="flex items-center text-sm text-gray-500 mt-2">
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No upcoming events</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">Club Details</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Users className="text-gray-500 mr-3 h-5 w-5" />
                  <span>{club.memberCount || 0} members</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="text-gray-500 mr-3 h-5 w-5" />
                  <span>{club.location || 'Location not specified'}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="text-gray-500 mr-3 h-5 w-5" />
                  <span>{club.email || 'Email not available'}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
  <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
  <div className="space-y-3">
    {club.members.includes(userId) ? (  
      <button
        disabled
        className="w-full bg-green-500 text-white font-semibold py-2 px-4 rounded-lg cursor-not-allowed"
      >
        Joined the Club
      </button>
    ) : (
      <button
        onClick={handleJoinClub}
        disabled={joining}
        className={`w-full text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ${
          joining ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {joining ? 'Joining...' : 'Join Club'}
      </button>
    )}
    <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors">
      Contact Club
    </button>
  </div>
</div>


            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">Club Categories</h2>
              <div className="flex flex-wrap gap-2">
                {club.categories?.map((category) => (
                  <span
                    key={category}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
