"use client"
import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

const ImageSlider = ({ upcomingEvents }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const allEvents = Object.entries(upcomingEvents || {}).reduce((acc, [category, events]) => {
    return [...acc, ...events.map(event => ({
      ...event,
      category
    }))];
  }, []);

  // Sort events by date
  const sortedEvents = allEvents.sort((a, b) => new Date(a.date) - new Date(b.date));

  // Use useCallback to memoize the nextSlide and prevSlide functions
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % Math.max(1, sortedEvents.length));
  }, [sortedEvents.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + sortedEvents.length) % Math.max(1, sortedEvents.length));
  }, [sortedEvents.length]);

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (sortedEvents.length <= 1) return; // Don't auto-slide if there's only one or zero events
    
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide, sortedEvents.length]);

  // If no events, show a placeholder
  if (!sortedEvents.length) {
    return (
      <div className="relative rounded-2xl shadow-lg overflow-hidden bg-gray-100">
        <div className="relative h-96 flex items-center justify-center">
          <div className="text-center">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No upcoming events to display</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl shadow-lg overflow-hidden">
      <div className="relative h-96" aria-roledescription="carousel" aria-label="Upcoming events gallery">
        {sortedEvents.map((event, index) => (
          <div
            key={`event-${event._id || index}`}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
            aria-hidden={index !== currentSlide}
            role="group"
            aria-roledescription="slide"
            aria-label={`Slide ${index + 1} of ${sortedEvents.length}: ${event.name}`}
          >
            <div className="relative h-full w-full">
              <Image
                src={event.image || "/image/image.png"}
                alt={`Event: ${event.name}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                priority={index === 0}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    event.category === 'sports' ? 'bg-blue-500' :
                    event.category === 'cultural' ? 'bg-green-500' :
                    'bg-purple-500'
                  }`}>
                    {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-2">{event.name}</h3>
                <p className="text-sm mb-2">
                  {new Date(event.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
                <p className="text-sm opacity-90">{event.description || 'Join us for this exciting event!'}</p>
              </div>
            </div>
          </div>
        ))}
        
        {/* Navigation Buttons */}
        {sortedEvents.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 z-20"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-6 w-6 text-gray-800" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 z-20"
              aria-label="Next slide"
            >
              <ChevronRight className="h-6 w-6 text-gray-800" />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20" role="tablist">
              {sortedEvents.map((_, index) => (
                <button
                  key={`dot-${index}`}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentSlide ? 'bg-white w-4' : 'bg-white/50'
                  }`}
                  role="tab"
                  aria-selected={index === currentSlide}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageSlider;