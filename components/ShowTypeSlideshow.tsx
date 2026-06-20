'use client';

import { useEffect, useState } from 'react';
import { IconChevronLeft, IconChevronRight, IconKids, IconSports, IconNews, IconMusic, IconEntertainment, IconReligious, IconMovies } from './Icons';

const SHOW_TYPES = [
  {
    id: 'drama',
    title: 'Drama Series',
    description: 'Captivating storytelling and compelling characters',
    icon: IconEntertainment,
    gradient: 'from-purple-600 to-pink-600',
    count: '850+ episodes',
  },
  {
    id: 'sports',
    title: 'Live Sports',
    description: 'Football, basketball, tennis, and more',
    icon: IconSports,
    gradient: 'from-orange-600 to-red-600',
    count: '24/7 coverage',
  },
  {
    id: 'news',
    title: 'Latest News',
    description: 'Global news updates and documentaries',
    icon: IconNews,
    gradient: 'from-blue-600 to-cyan-600',
    count: '50+ channels',
  },
  {
    id: 'kids',
    title: 'Kids Entertainment',
    description: 'Family-friendly shows and animations',
    icon: IconKids,
    gradient: 'from-green-600 to-emerald-600',
    count: '200+ shows',
  },
  {
    id: 'music',
    title: 'Music & Entertainment',
    description: 'Live concerts and music videos',
    icon: IconMusic,
    gradient: 'from-yellow-600 to-orange-600',
    count: '10+ channels',
  },
];

export default function ShowTypeSlideshow() {
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SHOW_TYPES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [autoPlay]);

  const next = () => {
    setCurrent((prev) => (prev + 1) % SHOW_TYPES.length);
    setAutoPlay(false);
  };

  const prev = () => {
    setCurrent((prev) => (prev - 1 + SHOW_TYPES.length) % SHOW_TYPES.length);
    setAutoPlay(false);
  };

  const CurrentIcon = SHOW_TYPES[current].icon;

  return (
    <section className="relative mb-12 overflow-hidden rounded-2xl">
      {/* Slideshow Container */}
      <div className="relative h-64 md:h-80 lg:h-96">
        {SHOW_TYPES.map((type, index) => (
          <div
            key={type.id}
            className={`absolute inset-0 bg-gradient-to-r ${type.gradient} transition-opacity duration-1000 ${
              index === current ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative h-full flex flex-col justify-center items-start px-6 md:px-12 lg:px-16">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                  <CurrentIcon className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">{type.title}</h2>
              <p className="text-lg text-white/90 mb-4 max-w-md">{type.description}</p>
              <div className="flex gap-4 items-center">
                <span className="text-sm font-semibold text-white/80 bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
                  {type.count}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/30 hover:bg-white/50 rounded-full backdrop-blur-sm transition-all"
        aria-label="Previous slide"
      >
        <IconChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/30 hover:bg-white/50 rounded-full backdrop-blur-sm transition-all"
        aria-label="Next slide"
      >
        <IconChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {SHOW_TYPES.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrent(index);
              setAutoPlay(false);
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              index === current ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
