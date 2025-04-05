"use client";
import { Check, ChevronDown, ChevronUp, Clock, Info, Shield, Star, X } from "lucide-react";
import { useState } from "react";

const ClubApprovalRequest = ({ onApprove, onReject }) => {
  const [expandedRequest, setExpandedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Sample data - replace with your actual data source
  const pendingRequests = [
    {
      id: "req-001",
      clubName: "Photography Club",
      description: "A club for photography enthusiasts to share techniques and organize photo walks around campus.",
      requestedBy: {
        name: "Michael Scott",
        email: "michael@example.com",
        role: "student"
      },
      proposedMembers: [
        { name: "Michael Scott", email: "michael@example.com", role: "president" },
        { name: "Jim Halpert", email: "jim@example.com", role: "admin" },
        { name: "Pam Beesly", email: "pam@example.com", role: "student" }
      ],
      submittedDate: "2025-04-01",
      status: "pending"
    },
    {
      id: "req-002",
      clubName: "Film Critics Society",
      description: "A club dedicated to film analysis, criticism, and appreciation with weekly screenings and discussions.",
      requestedBy: {
        name: "Dwight Schrute",
        email: "dwight@example.com",
        role: "student"
      },
      proposedMembers: [
        { name: "Dwight Schrute", email: "dwight@example.com", role: "president" },
        { name: "Angela Martin", email: "angela@example.com", role: "admin" }
      ],
      submittedDate: "2025-04-02",
      status: "pending"
    },
    {
      id: "req-003",
      clubName: "Environmental Action",
      description: "A club focused on campus sustainability initiatives and environmental awareness activities.",
      requestedBy: {
        name: "Oscar Martinez",
        email: "oscar@example.com",
        role: "student"
      },
      proposedMembers: [
        { name: "Oscar Martinez", email: "oscar@example.com", role: "president" },
        { name: "Kelly Kapoor", email: "kelly@example.com", role: "admin" },
        { name: "Ryan Howard", email: "ryan@example.com", role: "student" }
      ],
      submittedDate: "2025-04-03",
      status: "pending"
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

  const toggleRequestDetails = (requestId) => {
    setExpandedRequest(expandedRequest === requestId ? null : requestId);
  };

  const openRequestModal = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleApprove = (request) => {
    if (onApprove) {
      onApprove(request);
    }
    // Close modal after approval
    setShowModal(false);
    // You could also remove the request from the list or update its status
  };

  const handleReject = (request) => {
    if (onReject) {
      onReject(request);
    }
    // Close modal after rejection 
    setShowModal(false);
    // You could also remove the request from the list or update its status
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-500" />
            Pending Club Approval Requests
            <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
              {pendingRequests.length}
            </span>
          </h2>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No pending club approval requests.
          </div>
        ) : (
          <div className="divide-y">
            {pendingRequests.map((request) => (
              <div key={request.id} className="hover:bg-gray-50">
                <div 
                  className="p-4 cursor-pointer flex justify-between items-center"
                  onClick={() => toggleRequestDetails(request.id)}
                >
                  <div className="flex-grow">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{request.clubName}</h3>
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Pending
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Requested by {request.requestedBy.name} on {new Date(request.submittedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        openRequestModal(request);
                      }}
                      className="px-3 py-1 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
                    >
                      Review
                    </button>
                    {expandedRequest === request.id ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>

                {expandedRequest === request.id && (
                  <div className="p-4 bg-gray-50 border-t">
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Description</h4>
                      <p className="text-sm text-gray-600">{request.description}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Proposed Members ({request.proposedMembers.length})</h4>
                      <div className="bg-white border rounded-md overflow-hidden">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50 text-gray-700 text-left">
                            <tr>
                              <th className="p-2 pl-3">Name</th>
                              <th className="p-2">Email</th>
                              <th className="p-2">Role</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {request.proposedMembers.map((member, idx) => (
                              <tr key={idx} className="hover:bg-gray-50">
                                <td className="p-2 pl-3 font-medium">{member.name}</td>
                                <td className="p-2 text-gray-600">{member.email}</td>
                                <td className="p-2">
                                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeClass(member.role)}`}>
                                    {getRoleIcon(member.role)}
                                    <span className="capitalize">{member.role}</span>
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end gap-2">
                      <button 
                        onClick={() => handleReject(request)}
                        className="px-3 py-1 border border-gray-300 hover:bg-gray-100 rounded-md transition-colors flex items-center gap-1 text-sm"
                      >
                        <X className="h-4 w-4 text-red-500" />
                        Reject
                      </button>
                      <button 
                        onClick={() => handleApprove(request)}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors flex items-center gap-1 text-sm"
                      >
                        <Check className="h-4 w-4" />
                        Approve
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detailed Review Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-screen overflow-hidden flex flex-col">
            <div className="p-4 bg-gray-50 border-b flex justify-between items-center sticky top-0">
              <h2 className="text-xl font-bold flex items-center gap-2">
                Review Club Request
                <span className="text-sm font-normal text-gray-500">
                  ({selectedRequest.clubName})
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
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Club Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700">Club Name</h4>
                      <p className="text-gray-900">{selectedRequest.clubName}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Description</h4>
                      <p className="text-gray-900">{selectedRequest.description}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Requestor Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">Name</h4>
                        <p className="text-gray-900">{selectedRequest.requestedBy.name}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">Email</h4>
                        <p className="text-gray-900">{selectedRequest.requestedBy.email}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Proposed Members</h3>
                  <div className="bg-white border rounded-md overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50 text-gray-700 text-left">
                        <tr>
                          <th className="p-3">Name</th>
                          <th className="p-3">Email</th>
                          <th className="p-3">Role</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {selectedRequest.proposedMembers.map((member, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="p-3 font-medium">{member.name}</td>
                            <td className="p-3 text-gray-600">{member.email}</td>
                            <td className="p-3">
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeClass(member.role)}`}>
                                {getRoleIcon(member.role)}
                                <span className="capitalize">{member.role}</span>
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3">
                  <div className="flex-shrink-0">
                    <Info className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-800 mb-1">Review Guidelines</h4>
                    <p className="text-sm text-blue-700">
                      Please ensure the club adheres to school policies and has appropriate leadership structure. 
                      Approved clubs will be immediately visible in the system and members will be notified.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t bg-gray-50 flex justify-end gap-3 sticky bottom-0">
              <button 
                onClick={() => handleReject(selectedRequest)}
                className="px-4 py-2 border border-gray-300 hover:bg-gray-100 rounded-md transition-colors flex items-center gap-2"
              >
                <X className="h-4 w-4 text-red-500" />
                Reject Request
              </button>
              <button 
                onClick={() => handleApprove(selectedRequest)}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors flex items-center gap-2"
              >
                <Check className="h-4 w-4" />
                Approve Club
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClubApprovalRequest;