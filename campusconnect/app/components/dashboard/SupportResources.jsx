"use client"
import React from 'react';
import Link from 'next/link';
import { HelpCircle, Settings, Calendar } from 'lucide-react';

const SupportResources = () => {
  const resources = [
    {
      icon: HelpCircle,
      title: "Help Center",
      description: "Get assistance with your queries",
      href: "/help",
      color: "blue"
    },
    {
      icon: Settings,
      title: "Settings",
      description: "Manage your account preferences",
      href: "/settings",
      color: "purple"
    },
    {
      icon: Calendar,
      title: "Academic Calendar",
      description: "View important academic dates",
      href: "/calendar",
      color: "green"
    }
  ];

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-500',
    purple: 'bg-purple-100 text-purple-500',
    green: 'bg-green-100 text-green-500'
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
      <div className="p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">Support & Resources</h2>
        <div className="space-y-4">
          {resources.map((resource, index) => (
            <Link 
              key={index}
              href={resource.href} 
              className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <div className={`p-2 rounded-full ${colorClasses[resource.color]}`}>
                <resource.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">{resource.title}</p>
                <p className="text-sm text-gray-600">{resource.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SupportResources; 