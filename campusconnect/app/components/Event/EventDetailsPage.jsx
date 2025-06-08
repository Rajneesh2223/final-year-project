"use client";
import {
  AlertCircle,
  ArrowLeft,
  BadgeCheck,
  Calendar,
  Loader2,
  MapPin,
  User
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

// Let's create a temporary EventRegistration component in case there's an issue with the import
const EventRegistration = ({ onRegister, onShare, onDelete, userId, event, isAdmin }) => {
  const isRegistered = event.registeredUsers?.includes(userId);
  
  return (
    <div className="space-y-3">
      <button
        onClick={onRegister}
        className={`w-full py-3 px-4 rounded-lg font-medium ${
          isRegistered 
            ? "bg-green-100 text-green-700 hover:bg-green-200" 
            : "bg-blue-600 text-white hover:bg-blue-700"
        } transition-colors`}
      >
        {isRegistered ? "Already Registered" : "Register for Event"}
      </button>
      
      <button
        onClick={onShare}
        className="w-full py-3 px-4 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
      >
        Share Event
      </button>
      
      {isAdmin && (
        <button
          onClick={onDelete}
          className="w-full py-3 px-4 rounded-lg font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
        >
          Delete Event
        </button>
      )}
    </div>
  );
};

const EventDetailsPage = () => {
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();
  const eventId = params.id;
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null);

  // Get user info from localStorage (moved up to ensure consistent hook ordering)
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      setUserId(userData._id);
      setRole(userData.role);
    }
  }, []);

  // Fetch event details - now this useEffect is always in the same position
  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!eventId) return;
      
      try {
        const response = await fetch(`http://localhost:5000/api/events/${eventId}`, {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch event details');
        }
        const data = await response.json();
        setEvent(data);
      } catch (err) {
        console.error('Error fetching event:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const handleRegister = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/events/${eventId}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: userId }),
      });
  
      if (!response.ok) {
        throw new Error('Registration failed');
      }
  
      const data = await response.json();
      
      console.log('Registration successful:', data);
  
      // Update local state to reflect registration
      setEvent(prev => ({
        ...prev,
        registeredUsers: [...(prev.registeredUsers || []), userId],
        attendeesCount: (prev.attendeesCount || 0) + 1
      }));
  
    } catch (error) {
      console.error('Registration error:', error);
    }
  };
  
  const handleShare = () => {
    console.log('Sharing event');
  };

  const handleDelete = () => {
    console.log('Deleting event');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-8 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-xl text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-8 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-xl text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-8 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-xl text-gray-600">Event not found</p>
          <Link
            href="/events"
            className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
          >
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  // Format date
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Link
          href="/events"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8 group"
        >
          <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Events
        </Link>

        {/* Main Event Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="relative h-48 bg-gradient-to-r from-blue-600 to-indigo-700">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <div className="flex items-center gap-2 mb-2">
                <BadgeCheck className="h-5 w-5" />
                <span className="text-sm font-medium">{event.status}</span>
              </div>
              <h1 className="text-4xl font-bold">{event.name}</h1>
              <p className="mt-2 text-blue-100">{event.clubId?.name}</p>
            </div>
          </div>

          <div className="p-8">
            {/* Event Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="md:col-span-2">
                <div className="prose max-w-none">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">About This Event</h2>
                  <p className="text-gray-600 leading-relaxed">{event.description}</p>
                </div>

                {/* Event Details */}
                <div className="mt-8 space-y-4">
                  <div className="flex items-start gap-4">
                    <Calendar className="h-6 w-6 text-blue-500 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-800">Date & Time</h3>
                      <p className="text-gray-600">{formattedDate}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <MapPin className="h-6 w-6 text-blue-500 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-800">Location</h3>
                      <p className="text-gray-600">{event.location}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Organizer Info */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Organizer</h3>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{event.creatorName}</p>
                      <p className="text-sm text-gray-500 capitalize">{event.creatorRole}</p>
                    </div>
                  </div>
                </div>

                {/* Event Stats */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Event Stats</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Attendees</span>
                      <span className="font-medium text-gray-800">{event.attendeesCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Club</span>
                      <span className="font-medium text-gray-800">{event.clubId?.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Category</span>
                      <span className="font-medium text-gray-800">{event.clubId?.category}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <EventRegistration
                  onRegister={handleRegister}
                  onShare={handleShare}
                  onDelete={handleDelete}
                  userId={userId}
                  event={event}
                  isAdmin={role === "admin"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;