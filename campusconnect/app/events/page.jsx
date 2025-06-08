  // eslint-disable-next-line
  "use client";
  import {
  CalendarDays,
  Filter,
  MapPin,
  Plus,
  Search,
  Star,
  Tag,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";


  const EventsPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredEvents, setFilteredEvents] = useState([]);
    
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editFormData, setEditFormData] = useState({
      name: "",
      description: "",
      date: "",
      location: "",
      type: "",
      status: "",
      eventLink: ""
    });
    const [selectedFilters, setSelectedFilters] = useState({
      type: "",
      department: "",
      popularity: "",
    });
      const [userRole , setUserRole] = useState(null)
      console.log(userRole,"userRole")
    // Get club category from URL query parameter
    useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const clubCategory = params.get('club');
      if (clubCategory) {
        setSelectedFilters(prev => ({
          ...prev,
          department: clubCategory.charAt(0).toUpperCase() + clubCategory.slice(1)
        }));
      }
    }, []);

    // Fetch events when component mounts
    useEffect(() => {
      const fetchEvents = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/events',{
            credentials: 'include',
          });
          if (!response.ok) {
            throw new Error('Failed to fetch events');
          }
          const data = await response.json();
          console.log("data " , data);
          setEvents(data);
          setFilteredEvents(data);
          setIsLoading(false);
         
        } catch (err) {
          setError(err.message);
          setIsLoading(false);
        }
      };

      fetchEvents();
    }, []);

    // Filter events when search term or filters change
    useEffect(() => {
      let result = events.filter(
        (event) =>
          event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.clubId?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      // Apply additional filters
      if (selectedFilters.type) {
        result = result.filter((event) => event.type === selectedFilters.type);
      }

      if (selectedFilters.department) {
        result = result.filter(
          (event) => event.clubId?.category?.toLowerCase() === selectedFilters.department.toLowerCase()
        );
      }

      if (selectedFilters.popularity === "popular") {
        result = result.sort((a, b) => b.attendeesCount - a.attendeesCount);
      }

      setFilteredEvents(result);
    }, [searchTerm, selectedFilters, events]);

    // Render filter button with dropdown
    const FilterDropdown = ({ title, options, filterKey }) => {
      const [isOpen, setIsOpen] = useState(false);

      return (
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center px-4 py-2.5 rounded-full transition-all duration-300 ease-in-out ${
              selectedFilters[filterKey]
                ? "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 shadow-sm"
            }`}
          >
            <Filter className="mr-2 h-4 w-4" />
            {title}
            {selectedFilters[filterKey] && (
              <X
                className="ml-2 h-4 w-4 text-red-500 hover:text-red-700"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFilters((prev) => ({ ...prev, [filterKey]: "" }));
                }}
              />
            )}
          </button>
          {isOpen && (
            <div className="absolute z-20 mt-2 w-48 bg-white shadow-lg rounded-xl border border-gray-100 overflow-hidden">
              {options.map((option) => (
                <div
                  key={option}
                  onClick={() => {
                    setSelectedFilters((prev) => ({
                      ...prev,
                      [filterKey]: option,
                    }));
                    setIsOpen(false);
                  }}
                  className="px-4 py-2.5 hover:bg-gradient-to-r from-blue-50 to-blue-100 cursor-pointer transition-colors duration-200 ease-in-out"
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    };

    const handleEditClick = (event) => {
      setSelectedEvent(event);
      setEditFormData({
        name: event.name,
        description: event.description,
        date: event.date,
        location: event.location,
        type: event.type,
        status: event.status,
        eventLink: event.eventLink || ""
      });
      setIsEditModalOpen(true);
    };

    const handleEditSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch(`http://localhost:5000/api/events/${selectedEvent._id}`, {
          method: 'PUT',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to update event');
        }

        const updatedEvent = await response.json();
        setEvents(events.map(event => 
          event._id === updatedEvent._id ? updatedEvent : event
        ));
        setIsEditModalOpen(false);
        setSelectedEvent(null);
      } catch (err) {
        setError(err.message);
      }
    };

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-xl text-gray-600">Loading...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-xl text-red-600">Error: {error}</div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-12 bg-white rounded-xl shadow-lg p-6">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Campus Events Hub
            </h1>
            {(userRole === "admin" || userRole === "clubhead") && (
  <Link
    href="/create-event"
    className="flex items-center bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-3 rounded-full shadow-xl transform transition duration-300 hover:scale-105 hover:shadow-2xl"
  >
    <Plus className="mr-2 h-5 w-5" />
    Create Event
  </Link>
)}

          </div>

          {/* Search and Filters */}
          <div className="mb-12 flex space-x-6">
            <div className="relative flex-grow">
              <input
                type="search"
                placeholder="Discover events by name, location, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-gray-700"
              />
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            </div>

            <div className="flex space-x-4">
              <FilterDropdown
                title="Type"
                filterKey="type"
                options={["Technical", "Cultural", "Professional"]}
              />
              <FilterDropdown
                title="Department"
                filterKey="department"
                options={["Computer Science", "Fine Arts", "Career Services"]}
              />
              <FilterDropdown
                title="Popularity"
                filterKey="popularity"
                options={["popular"]}
              />
            </div>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-2xl overflow-hidden shadow-2xl transform transition duration-300 hover:scale-105 hover:shadow-3xl"
              >
              
                <div
                  className={`h-2 w-full bg-gradient-to-r ${event.gradient}`}
                ></div>

                <div className="p-6 relative">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold text-gray-800 w-3/4">
                      {event.name}
                    </h2>
                    <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center text-yellow-500 bg-yellow-50 rounded-full px-3 py-1">
  <Star className="h-4 w-4 mr-1" />
  <span className="text-sm font-semibold">
    {event.registeredUsers.length} / {event.attendeesCount}
  </span>
</div>
                      <div className="flex items-center text-blue-500 bg-blue-50 rounded-full px-3 py-1">
                        <Tag className="h-4 w-4 mr-1" />
                        <span className="text-sm font-semibold">
                          {event.clubId?.category || 'Uncategorized'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {event.description}
                  </p>

                  <div className="space-y-3">
                    {[
                      { icon: CalendarDays, text: event.date },
                      { icon: MapPin, text: event.location },
                      { icon: Tag, text: event.clubId?.category },
                      { icon: Users, text: event.clubId?.name || 'Unknown Club' },
                    ].map(({ icon: Icon, text }, index) => (
                      <p
                        key={index}
                        className="flex items-center text-gray-500 text-sm"
                      >
                        <Icon className="h-4 w-4 mr-3 text-blue-500" />
                        {text}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="border-t px-6 py-4 bg-gray-50">
                  <div className="flex gap-4">
                    <Link
                      href={`/events/${event._id}`}
                      className="flex-1 block text-center bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 rounded-full transition duration-300 transform hover:scale-105 hover:shadow-xl"
                    >
                      View Event Details
                    </Link>
                    <button
                      onClick={() => handleEditClick(event)}
                      className="flex items-center justify-center bg-gradient-to-r from-green-600 to-emerald-700 text-white py-3 px-4 rounded-full transition duration-300 transform hover:scale-105 hover:shadow-xl"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2"
                      >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
              <p className="text-2xl text-gray-500 font-light">
                No events found matching your search criteria.
              </p>
              <p className="text-gray-400 mt-4">
                Try adjusting your search or filters
              </p>
            </div>
          )}

          {/* Edit Modal */}
          {isEditModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Edit Event</h2>
                  <button
                    onClick={() => setIsEditModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
                <form onSubmit={handleEditSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Event Name
                    </label>
                    <input
                      type="text"
                      value={editFormData.name}
                      onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={editFormData.description}
                      onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows="3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date
                      </label>
                      <input
                        type="date"
                        value={editFormData.date}
                        onChange={(e) => setEditFormData({...editFormData, date: e.target.value})}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={editFormData.location}
                        onChange={(e) => setEditFormData({...editFormData, location: e.target.value})}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type
                      </label>
                      <select
                        value={editFormData.type}
                        onChange={(e) => setEditFormData({...editFormData, type: e.target.value})}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select Type</option>
                        <option value="Technical">Technical</option>
                        <option value="Cultural">Cultural</option>
                        <option value="Professional">Professional</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        value={editFormData.status}
                        onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select Status</option>
                        <option value="Upcoming">Upcoming</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Event Link (Optional)
                    </label>
                    <input
                      type="url"
                      value={editFormData.eventLink}
                      onChange={(e) => setEditFormData({...editFormData, eventLink: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://..."
                    />
                  </div>
                  <div className="flex justify-end gap-4 mt-6">
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-lg hover:shadow-lg"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  export default EventsPage;
