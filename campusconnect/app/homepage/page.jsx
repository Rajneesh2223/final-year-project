"use client"
import React from 'react';
const HomePage = () => {
  
 console.log("user",user);
 console.log(store.getState());
  return (
    <div className="container mx-auto px-4 ">
      <h1 className="text-4xl font-bold mb-8">Welcome to CampusConnect</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6 transform transition hover:scale-105 duration-300">
          <h2 className="text-xl font-bold mb-2">Upcoming Events</h2>
          <p className="text-gray-500 mb-4">Check out the latest campus events</p>
          <p className="text-gray-700 mb-4">Discover and participate in exciting events happening on campus.</p>
          <a 
            href="/events" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-300 block text-center"
          >
            View Events
          </a>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 transform transition hover:scale-105 duration-300">
          <h2 className="text-xl font-bold mb-2">Join Clubs</h2>
          <p className="text-gray-500 mb-4">Explore student organizations</p>
          <p className="text-gray-700 mb-4">Find and join clubs that match your interests and passions.</p>
          <a 
            href="/clubs" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-300 block text-center"
          >
            Explore Clubs
          </a>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 transform transition hover:scale-105 duration-300">
          <h2 className="text-xl font-bold mb-2">Get Started</h2>
          <p className="text-gray-500 mb-4">Create your account</p>
          <p className="text-gray-700 mb-4">Sign up to unlock all features and start your campus journey.</p>
          <a 
            href="/register" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-300 block text-center"
          >
            Register Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default HomePage;