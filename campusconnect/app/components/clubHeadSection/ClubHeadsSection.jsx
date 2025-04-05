// components/ClubHeadsSection.jsx
import { Users, Crown, Mail, UserPlus, ChevronsUp, User, Plus, BarChart2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import clubHead from '../../../public/clubHead/clubHead.png'

const ClubHeadsSection = ({ isAdmin }) => {
  const [clubData, setClubData] = useState([]);
  const [sortBy, setSortBy] = useState('members');
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHead, setNewHead] = useState({
    name: '',
    club: '',
    email: ''
  });

  // Simulate API fetch with growth tracking
  useEffect(() => {
    const fetchClubData = async () => {
      try {
        // Simulated data with both club heads and member counts
        const simulatedData = [
          {
            id: 1,
            name: 'Alex Johnson',
            club: 'Coding Club',
            email: 'alex@itelucknow.ac.in',
            members: 124,
            heads: 2, // Number of club heads
            newMembers: 15,
            growthRate: 12.3,
            image: clubHead
          },
          {
            id: 2,
            name: 'Priya Singh',
            club: 'Drama Society',
            email: 'priya@itelucknow.ac.in',
            members: 87,
            heads: 3,
            newMembers: 22,
            growthRate: 25.8,
            image: clubHead
          },
          {
            id: 3,
            name: 'Rahul Verma',
            club: 'Robotics Club',
            email: 'rahul@itelucknow.ac.in',
            members: 156,
            heads: 4,
            newMembers: 42,
            growthRate: 27.1,
            image: clubHead
          },
        ];

        // Simulate growth
        const updatedData = simulatedData.map(club => ({
          ...club,
          members: club.members + Math.floor(Math.random() * 5),
          heads: club.heads + (Math.random() > 0.7 ? 1 : 0), // 30% chance of new head
          newMembers: club.newMembers + Math.floor(Math.random() * 3)
        }));

        setClubData(updatedData);
      } catch (error) {
        console.error('Failed to fetch club data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClubData();
    const interval = setInterval(fetchClubData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleAddHead = () => {
    // In a real app, this would be an API call
    const newClub = {
      id: Math.max(...clubData.map(c => c.id)) + 1,
      ...newHead,
      members: 10,
      heads: 1,
      newMembers: 10,
      growthRate: 100,
        image: clubHead
    };
    
    setClubData([...clubData, newClub]);
    setNewHead({ name: '', club: '', email: '' });
    setShowAddForm(false);
  };

  const sortedClubs = [...clubData].sort((a, b) => {
    if (sortBy === 'members') return b.members - a.members;
    if (sortBy === 'heads') return b.heads - a.heads;
    if (sortBy === 'growth') return b.growthRate - a.growthRate;
    return 0;
  });

  if (loading) return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-40 bg-gray-100 rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <Users className="h-6 w-6 mr-3 text-indigo-600" />
            Club Management Dashboard
          </h2>
          
          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-500">Sort by:</div>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-100 border-0 rounded-md px-3 py-1 text-sm"
            >
              <option value="members">Members</option>
              <option value="heads">Heads</option>
              <option value="growth">Growth</option>
            </select>
            
            {isAdmin && (
              <button 
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center bg-indigo-600 text-white px-3 py-1 rounded-md text-sm hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Club
              </button>
            )}
          </div>
        </div>

        {showAddForm && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6 animate-fadeIn">
            <h3 className="font-medium mb-3">Add New Club Head</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Name"
                className="p-2 border rounded"
                value={newHead.name}
                onChange={(e) => setNewHead({...newHead, name: e.target.value})}
              />
              <input
                type="text"
                placeholder="Club Name"
                className="p-2 border rounded"
                value={newHead.club}
                onChange={(e) => setNewHead({...newHead, club: e.target.value})}
              />
              <input
                type="email"
                placeholder="Email"
                className="p-2 border rounded"
                value={newHead.email}
                onChange={(e) => setNewHead({...newHead, email: e.target.value})}
              />
            </div>
            <div className="flex justify-end mt-3 space-x-2">
              <button 
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1 bg-gray-200 rounded-md text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddHead}
                className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
              >
                Add Club
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sortedClubs.map((club) => (
            <div key={club.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative">
                <Image 
                  src={club.image} 
                  alt={club.club}
                  className="w-full h-32 object-cover"
                />
                <div className="absolute top-3 left-3 bg-indigo-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                  <Crown className="h-3 w-3 mr-1" />
                  {club.heads} {club.heads === 1 ? 'Head' : 'Heads'}
                </div>
              </div>
              
              <div className="p-5">
                <h3 className="font-bold text-lg mb-1">{club.club}</h3>
                <p className="text-gray-600 text-sm mb-3">Led by {club.name}</p>
                
                {/* <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-gray-500 text-xs mb-1">Total Members</div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-indigo-600" />
                      <span className="font-bold">{club.members}</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-gray-500 text-xs mb-1">New Members</div>
                    <div className="flex items-center">
                      <UserPlus className="h-4 w-4 mr-2 text-green-600" />
                      <span className="font-bold">+{club.newMembers}</span>
                    </div>
                  </div>
                </div> */}
                
                {/* <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg mb-4">
                  <div className="flex items-center">
                    <ChevronsUp className="h-4 w-4 mr-2 text-blue-600" />
                    <span className="text-sm">Growth Rate</span>
                  </div>
                  <span className={`font-bold ${
                    club.growthRate > 20 ? 'text-green-600' : 'text-blue-600'
                  }`}>
                    {club.growthRate}%
                  </span>
                </div> */}
                
                <div className="flex space-x-2">
                  <a 
                    href={`mailto:${club.email}`}
                    className="flex-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 text-center py-2 rounded-md text-sm transition-colors flex items-center justify-center"
                  >
                    <Mail className="h-4 w-4 mr-1" />
                    Contact
                  </a>
                  <button className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 text-center py-2 rounded-md text-sm transition-colors flex items-center justify-center">
                    <BarChart2 className="h-4 w-4 mr-1" />
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClubHeadsSection;