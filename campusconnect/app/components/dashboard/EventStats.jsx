"use client"
import React from 'react';
import StatCard from './StatCard';
import { Trophy, Music, Code } from 'lucide-react';

const EventStats = ({ eventCounts, isLoading }) => {
  const STAT_CARDS = [
    {
      icon: Trophy, // Pass the component itself, not JSX
      title: "Sports Events",
      count: eventCounts.sports || 0,
      color: "blue",
      href: "/events?category=sports",
      description: "Athletic competitions and sports activities",
      clubId: "sports"
    },
    {
      icon: Music, // Pass the component itself
      title: "Cultural Events",
      count: eventCounts.cultural || 0,
      color: "green",
      href: "/events?category=cultural",
      description: "Art, music, and cultural performances",
      clubId: "cultural"
    },
    {
      icon: Code, // Pass the component itself
      title: "Technical Events",
      count: eventCounts.technical || 0,
      color: "purple",
      href: "/events?category=technical",
      description: "Technology and innovation workshops",
      clubId: "technical"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {STAT_CARDS.map((card, index) => (
        <StatCard
          key={index}
          Icon={card.icon} // Changed prop name to uppercase Icon
          title={card.title}
          count={card.count}
          color={card.color}
          href={card.href}
          description={card.description}
          clubId={card.clubId}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
};

export default EventStats;