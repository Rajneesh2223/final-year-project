import React, { useState } from 'react';
import { 
  Camera,
  Users,
  BookOpen,
  Globe,
  Star,
  ArrowLeft,
  Loader2
} from 'lucide-react';

const CreateClubPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    meetingLocation: '',
    meetingTime: '',
    maxMembers: '',
    socialLinks: {
      instagram: '',
      discord: ''
    }
  });

  const categories = [
    { id: 'technology', label: 'Technology', icon: Globe, gradient: 'from-blue-500 to-purple-600' },
    { id: 'arts', label: 'Arts', icon: BookOpen, gradient: 'from-pink-500 to-orange-500' },
    { id: 'academic', label: 'Academic', icon: Star, gradient: 'from-green-400 to-teal-500' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    // Handle your form submission here
    console.log(formData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <a href="/clubs" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 group">
            <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
            Back to Clubs
          </a>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            Create a New Club
          </h1>
          <p className="mt-2 text-gray-600">Fill in the details below to establish your club's presence on campus.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Main Info Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="space-y-6">
              {/* Club Logo Upload */}
              <div className="flex justify-center">
                <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-50 transition-colors">
                  <Camera className="w-8 h-8 text-gray-400" />
                </div>
              </div>

              {/* Basic Info */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Club Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
                  placeholder="Enter club name"
                />
              </div>

              {/* Category Selection */}
              <div className="grid grid-cols-3 gap-4">
                {categories.map(({ id, label, icon: Icon, gradient }) => (
                  <button
                    type="button"
                    key={id}
                    onClick={() => setFormData(prev => ({ ...prev, category: id }))}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.category === id 
                        ? `border-transparent bg-gradient-to-r ${gradient} text-white shadow-lg`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-6 h-6 mx-auto mb-2" />
                    <span className="block text-sm font-medium">{label}</span>
                  </button>
                ))}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
                  placeholder="Describe your club's mission and activities..."
                />
              </div>
            </div>
          </div>

          {/* Meeting Details Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-xl font-semibold mb-6">Meeting Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  name="meetingLocation"
                  value={formData.meetingLocation}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
                  placeholder="Where do you meet?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Time</label>
                <input
                  type="text"
                  name="meetingTime"
                  value={formData.meetingTime}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
                  placeholder="When do you meet?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Members</label>
                <input
                  type="number"
                  name="maxMembers"
                  value={formData.maxMembers}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
                  placeholder="Enter maximum capacity"
                />
              </div>
            </div>
          </div>

          {/* Social Links Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-xl font-semibold mb-6">Social Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                <input
                  type="text"
                  name="socialLinks.instagram"
                  value={formData.socialLinks.instagram}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
                  placeholder="@yourclub"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Discord</label>
                <input
                  type="text"
                  name="socialLinks.discord"
                  value={formData.socialLinks.discord}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
                  placeholder="Discord invite link"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 rounded-xl shadow-xl transform transition duration-300 hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Creating Club...
              </span>
            ) : (
              'Create Club'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateClubPage;
