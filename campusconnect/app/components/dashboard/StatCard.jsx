"use client"
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const BACKGROUND_IMAGE = '/image/image.png';

const StatCard = ({ icon: Icon, title, count, color, href, description, clubId }) => {
  const colorClasses = {
    blue: 'text-blue-500 bg-blue-50',
    green: 'text-green-500 bg-green-50',
    purple: 'text-purple-500 bg-purple-50',
    orange: 'text-orange-500 bg-orange-50'
  };

  const borderColorClasses = {
    blue: 'border-blue-200',
    green: 'border-green-200',
    purple: 'border-purple-200',
    orange: 'border-orange-200'
  };

  return (
    <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden transform transition hover:scale-105 duration-300 h-full flex flex-col">
      <div className="absolute inset-0 z-0">
        <Image 
          src={BACKGROUND_IMAGE} 
          alt="Card Background" 
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="opacity-45 object-cover"
        />
      </div>
    
      <div className="relative z-10 p-6 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${colorClasses[color]} mr-3`}>
              <Icon className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          </div>
          <div className={`${colorClasses[color]} rounded-full p-3`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>

        <div className="flex-grow">
          <div className={`text-4xl font-bold ${colorClasses[color]} mb-3`}>
            {count}
          </div>
          <p className="text-gray-600 text-base">{description}</p>
        </div>

        <div className={`mt-6 pt-4 border-t ${borderColorClasses[color]}`}>
          <Link 
            href={`/events?club=${clubId}`}
            className={`${colorClasses[color]} hover:opacity-80 font-semibold flex items-center focus:outline-none focus:underline`}
          >
            View Details
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StatCard; 