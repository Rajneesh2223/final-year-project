"use client"
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Globe,
  MapPin,
  Plus,
  Search,
  Star,
  TrendingUp,
  Users
} from 'lucide-react';
import { useEffect, useState } from 'react';


const ClubsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const [role, setRole] = useState('');
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setRole(parsedUser.role);
    }

    const fetchClubs = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/clubs', {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch clubs');
        }
        const data = await response.json();
        const transformedClubs = data.map(club => ({
          ...club,
          id: club._id,
          members: club.membersCount,
          gradient: getGradientForCategory(club.category)
        }));
        setClubs(transformedClubs);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  const getGradientForCategory = (category) => {
    const gradients = {
      "Technology": "from-blue-500 to-purple-600",
      "Arts": "from-pink-500 to-orange-500",
      "Academic": "from-green-400 to-teal-500"
    };
    return gradients[category] || "from-gray-500 to-gray-600";
  };

  const filteredClubs = clubs.filter(club => 
    (club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    club.category.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedCategory === '' || club.category === selectedCategory)
  );

  const sortedClubs = [...filteredClubs].sort((a, b) => {
    if (sortBy === 'popular') return b.members - a.members;
    if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  const categoryIcons = {
    "Technology": Globe,
    "Arts": BookOpen,
    "Academic": Star
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12 bg-white rounded-xl shadow-lg p-6">
          <div>
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Campus Clubs
            </h1>
            <p className="text-gray-600 mt-2">Discover and join exciting student organizations</p>
          </div>
     
          {role === 'admin' && (
  <a 
    href="/clubs/create" 
    className="flex items-center bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-3 rounded-full shadow-xl transform transition duration-300 hover:scale-105 hover:shadow-2xl"
  >
    <Plus className="mr-2 h-5 w-5" />
    Create Club
  </a>
)}

        </div>

        {/* Search and Filters */}
        <div className="mb-12 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
          <div className="relative flex-grow">
            <input 
              type="search" 
              placeholder="Discover clubs by name or category..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-gray-700"
            />
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
          </div>

          <div className="flex space-x-4">
            {Object.keys(categoryIcons).map((category) => {
              const Icon = categoryIcons[category];
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(selectedCategory === category ? '' : category)}
                  className={`flex items-center px-4 py-2.5 rounded-full transition-all duration-300 ease-in-out ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 shadow-sm'
                  }`}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {category}
                </button>
              );
            })}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border-2 border-gray-200 rounded-full px-4 py-2.5 focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
          >
            <option value="popular">Most Popular</option>
            <option value="newest">Newest First</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>

        {/* Featured Clubs Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <TrendingUp className="mr-2 h-6 w-6 text-blue-500" />
            Featured Clubs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedClubs.filter(club => club.isFeatured).map((club) => (
              <ClubCard key={club.id} club={club} categoryIcons={categoryIcons} />
            ))}
          </div>
        </div>

        {/* All Clubs Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">All Clubs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedClubs.map((club) => (
              <ClubCard key={club.id} club={club} categoryIcons={categoryIcons} />
            ))}
          </div>
        </div>

        {filteredClubs.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <p className="text-2xl text-gray-500 font-light">
              No clubs found matching your search criteria.
            </p>
            <p className="text-gray-400 mt-4">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ClubCard = ({ club, categoryIcons }) => {
  const CategoryIcon = categoryIcons[club.category] || Globe;
  
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-2xl transform transition duration-300 hover:scale-105 hover:shadow-3xl">
      {/* Gradient Header */}
      <div className={`h-2 w-full bg-gradient-to-r ${club.gradient}`}></div>
      
      <div className="p-6 relative">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800">{club.name}</h2>
            <div className="flex items-center mt-2">
              <div className="flex items-center text-yellow-500 bg-yellow-50 rounded-full px-3 py-1">
                <Users className="h-4 w-4 mr-1" />
                <span className="text-sm font-semibold">{club.members}</span>
              </div>
              {club.status === 'Active' && (
                <div className="ml-2 flex items-center text-green-500 bg-green-50 rounded-full px-3 py-1">
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  <span className="text-sm font-semibold">Active</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-2">{club.description}</p>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-gray-600 text-sm">
            <Calendar className="h-4 w-4 mr-2 text-blue-500" />
            {club.meetingSchedule}
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="h-4 w-4 mr-2 text-blue-500" />
            {club.location}
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <CategoryIcon className="h-4 w-4 mr-2 text-blue-500" />
            {club.category}
          </div>
        </div>

        {club.upcomingEvents.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Upcoming Events:</h3>
            <div className="flex flex-wrap gap-2">
              {club.upcomingEvents.map((event, index) => (
                <span key={index} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">
                  {event}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="border-t px-6 py-4 bg-gray-50">
        <a 
          href={`/clubs/${club.id}`} 
          className="w-full block text-center bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 rounded-full transition duration-300 transform hover:scale-105 hover:shadow-xl"
        >
          View Club Details
        </a>
      </div>
    </div>
  );
};

export default ClubsPage;
