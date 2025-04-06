"use client";
import { ChevronDown, Mail, Search, Shield, Star, User, Users, X } from "lucide-react";
import { useState } from "react";

const AdminUserPanel = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClub, setSelectedClub] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const clubData = [
    {
      name: "Robotics Club",
      members: [
        { name: "Alice", email: "alice@example.com", role: "student" },
        { name: "Charlie", email: "charlie@example.com", role: "student" }
      ]
    },
    {
      name: "Art Club",
      members: [
        { name: "Bob", email: "bob@example.com", role: "student" },
        { name: "Eve", email: "eve@example.com", role: "admin" }
      ]
    },
    {
      name: "Sports Club",
      members: [
        { name: "Frank", email: "frank@example.com", role: "president" }
      ]
    },
    {
      name: "Chess Club",
      members: [
        { name: "George", email: "george@example.com", role: "student" },
        { name: "Hannah", email: "hannah@example.com", role: "admin" }
      ]
    },
    {
      name: "Debate Club",
      members: [
        { name: "Isaac", email: "isaac@example.com", role: "president" },
        { name: "Julia", email: "julia@example.com", role: "student" }
      ]
    },
    {
      name: "Music Club",
      members: [
        { name: "Kevin", email: "kevin@example.com", role: "student" },
        { name: "Linda", email: "linda@example.com", role: "admin" }
      ]
    }
  ];

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin": return <Shield className="h-4 w-4 text-blue-500" />;
      case "president": return <Star className="h-4 w-4 text-yellow-500" />;
      default: return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case "admin": return "bg-blue-100 text-blue-800";
      case "president": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Filter clubs based on search term
  const filteredClubs = clubData.filter(club => 
    club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    club.members.some(member => 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const openClubModal = (club) => {
    setSelectedClub(club);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className=" mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-black">
          <Users className="h-6 w-6 text-indigo-600" />
          Club Members Management
        </h1>
      </div>

      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search clubs or members..."
          className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-black"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredClubs.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No clubs or members match your search</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClubs.map((club) => (
            <div key={club.name} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div 
                onClick={() => openClubModal(club)}
                className="p-4 bg-gray-50  text-black flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div>
                  <h2 className="text-lg font-semibold text-black">{club.name}</h2>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {club.members.length} Member{club.members.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <ChevronDown className="h-5 w-5 text-gray-500" />
              </div>
              
              <div className="p-4 border-t">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">
                      {club.members.filter(m => m.role === "admin" || m.role === "president").length > 0 ? (
                        <>
                          Lead by: {' '}
                          {club.members
                            .filter(m => m.role === "admin" || m.role === "president")
                            .map(m => m.name)
                            .join(', ')}
                        </>
                      ) : 'No administrators'}
                    </p>
                  </div>
                  <button 
                    onClick={() => openClubModal(club)}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    View Members
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && selectedClub && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-screen overflow-hidden flex flex-col">
            <div className="p-4 bg-gray-50  text-black border-b flex justify-between items-center sticky top-0">
              <h2 className="text-xl font-bold flex items-center gap-2 text-black">
                {selectedClub.name}
                <span className="text-sm font-normal text-gray-500">
                  ({selectedClub.members.length} Member{selectedClub.members.length !== 1 ? 's' : ''})
                </span>
              </h2>
              <button 
                onClick={closeModal}
                className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-grow">
              <table className="w-full">
                <thead className="text-left text-sm text-gray-500 border-b">
                  <tr>
                    <th className="pb-3 pl-2">Name</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3">Role</th>
                    <th className="pb-3 text-right pr-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {selectedClub.members.map((member, index) => (
                    <tr key={index} className="hover:bg-gray-50 group">
                      <td className="py-4 pl-2 font-medium text-black">{member.name}</td>
                      <td className="py-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          {member.email}
                        </div>
                      </td>
                      <td className="py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeClass(member.role)}`}>
                          {getRoleIcon(member.role)}
                          <span className="capitalize">{member.role}</span>
                        </span>
                      </td>
                      <td className="py-4 text-right pr-2">
                        <div className="invisible group-hover:visible flex justify-end gap-2">
                          <button className="text-gray-500 hover:text-indigo-600 p-1 rounded hover:bg-gray-100">
                            Edit
                          </button>
                          <button className="text-gray-500 hover:text-red-600 p-1 rounded hover:bg-gray-100">
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 border-t bg-gray-50 flex justify-end sticky bottom-0">
              <button 
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors text-red-300 bg-red-500/10"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserPanel;