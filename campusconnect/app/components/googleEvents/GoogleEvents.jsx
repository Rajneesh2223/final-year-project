import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, ExternalLink, Search, Filter } from 'lucide-react';

const GoogleEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [eventType, setEventType] = useState('all');

  // Mock data for demonstration (replace with actual API calls)
  const mockEvents = [
    {
      id: 1,
      title: "Google I/O 2024",
      description: "Google's annual developer conference featuring the latest in AI, Android, and Web technologies.",
      startTime: "2024-05-14T10:00:00Z",
      endTime: "2024-05-16T18:00:00Z",
      location: "Mountain View, CA",
      link: "https://io.google/2024/",
      type: "conference",
      source: "Google Events"
    },
    {
      id: 2,
      title: "Google Cloud Next 2024",
      description: "The ultimate event for developers, data scientists, and ML engineers.",
      startTime: "2024-04-09T09:00:00Z",
      endTime: "2024-04-11T17:00:00Z",
      location: "Las Vegas, NV",
      link: "https://cloud.google.com/next",
      type: "conference",
      source: "Google Cloud"
    },
    {
      id: 3,
      title: "Android Dev Summit",
      description: "Technical talks and hands-on learning for Android developers.",
      startTime: "2024-06-15T10:00:00Z",
      endTime: "2024-06-15T16:00:00Z",
      location: "Virtual Event",
      link: "https://developer.android.com/events",
      type: "workshop",
      source: "Android Developers"
    }
  ];

  // Google Calendar API integration
  const fetchGoogleCalendarEvents = async (calendarId, apiKey) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${apiKey}&timeMin=${new Date().toISOString()}&singleEvents=true&orderBy=startTime&maxResults=20`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch calendar events');
      }
      
      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      return [];
    }
  };

  // SerpApi Google Events integration
  const fetchSerpApiEvents = async (query, location, apiKey) => {
    try {
      const params = new URLSearchParams({
        engine: 'google_events',
        q: query,
        location: location,
        api_key: apiKey
      });

      const response = await fetch(`https://serpapi.com/search?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch events from SerpApi');
      }
      
      const data = await response.json();
      return data.events_results || [];
    } catch (error) {
      console.error('Error fetching SerpApi events:', error);
      return [];
    }
  };

  const searchEvents = async () => {
    setLoading(true);
    setError('');
    
    try {
     
      await new Promise(resolve => setTimeout(resolve, 1000));
    
      let filteredEvents = mockEvents;
      
      if (searchQuery) {
        filteredEvents = filteredEvents.filter(event => 
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      if (location) {
        filteredEvents = filteredEvents.filter(event => 
          event.location.toLowerCase().includes(location.toLowerCase())
        );
      }
      
      if (eventType !== 'all') {
        filteredEvents = filteredEvents.filter(event => event.type === eventType);
      }
      
      setEvents(filteredEvents);
    } catch (err) {
      setError('Failed to fetch events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchEvents();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventTypeColor = (type) => {
    const colors = {
      conference: 'bg-blue-100 text-blue-800',
      workshop: 'bg-green-100 text-green-800',
      webinar: 'bg-purple-100 text-purple-800',
      meetup: 'bg-orange-100 text-orange-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Google Events</h1>
        <p className="text-gray-600">Discover upcoming events from Google and the developer community</p>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="conference">Conferences</option>
              <option value="workshop">Workshops</option>
              <option value="webinar">Webinars</option>
              <option value="meetup">Meetups</option>
            </select>
          </div>
          
          <button
            onClick={searchEvents}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Searching...' : 'Search Events'}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading events...</span>
        </div>
      )}

      {/* Events Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
                    {event.type}
                  </span>
                  <span className="text-xs text-gray-500">{event.source}</span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{event.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{formatDate(event.startTime)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{event.location}</span>
                  </div>
                </div>
                
                <a
                  href={event.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View Event
                  <ExternalLink className="h-4 w-4 ml-1" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {!loading && events.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or check back later for new events.</p>
        </div>
      )}

      {/* API Setup Instructions */}
      <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">API Setup Instructions</h3>
        <div className="space-y-3 text-sm">
          <div>
            <h4 className="font-medium text-blue-800">Google Calendar API:</h4>
            <p className="text-blue-700">1. Go to Google Cloud Console</p>
            <p className="text-blue-700">2. Enable Google Calendar API</p>
            <p className="text-blue-700">3. Create credentials (API key or OAuth 2.0)</p>
            <p className="text-blue-700">4. Replace the fetchGoogleCalendarEvents function with your API key</p>
          </div>
          <div>
            <h4 className="font-medium text-blue-800">SerpApi (Alternative):</h4>
            <p className="text-blue-700">1. Sign up at serpapi.com</p>
            <p className="text-blue-700">2. Get your API key</p>
            <p className="text-blue-700">3. Replace the fetchSerpApiEvents function with your API key</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleEvents;