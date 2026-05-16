import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ id, title, genre, image, tag, tagStyle, isUpcoming, date }) => {
  if (isUpcoming) {
    return (
      <Link to={`/movie/${id}`} className="flex-none w-72 group">
        <div className="relative aspect-[2/3] rounded-xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-500">
          <img alt="Upcoming" className="w-full h-full object-cover" src={image} />
          <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent opacity-60"></div>
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-[10px] font-bold text-primary tracking-[0.2em] mb-1">DỰ KIẾN: {date}</p>
            <h4 className="font-headline text-lg font-bold leading-tight">{title}</h4>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/movie/${id}`} className="group relative flex flex-col gap-4">
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-surface-container-low">
        <img alt="Movie Poster" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={image} />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button className="bg-primary-container text-on-primary-container p-4 rounded-full shadow-lg shadow-primary-container/40">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>confirmation_number</span>
          </button>
        </div>
        {tag && (
          <div className={`absolute top-4 left-4 px-2 py-1 rounded text-[10px] font-black ${tagStyle}`}>
            {tag}
          </div>
        )}
      </div>
      <div className="flex flex-col">
        <h4 className="font-headline text-xl font-bold leading-tight group-hover:text-primary-container transition-colors">{title}</h4>
        <p className="text-secondary text-sm mt-1">{genre}</p>
      </div>
    </Link>
  );
};

export default MovieCard;