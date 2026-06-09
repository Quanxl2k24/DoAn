import React from 'react';
import { Link } from 'react-router-dom';
import MovieCard from './MovieCard';

const MovieSection = ({ title, description, linkText, movies, isUpcoming }) => {
  return (
    <section className="px-6 md:px-16 py-20 max-w-[1920px] mx-auto overflow-hidden">
      {isUpcoming ? (
        <h3 className="font-headline text-4xl font-bold tracking-tight mb-12">{title}</h3>
      ) : (
        <div className="flex justify-between items-end mb-12">
          <div>
            <h3 className="font-headline text-4xl font-bold tracking-tight mb-2">{title}</h3>
            <p className="text-secondary opacity-70">{description}</p>
          </div>
          {linkText && (
            <Link to="/showtimes" className="text-primary-container font-bold flex items-center gap-2 hover:translate-x-1 transition-transform">
              {linkText} <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          )}
        </div>
      )}

      {isUpcoming ? (
        <div className="flex gap-8 overflow-x-auto hide-scrollbar pb-10">
          {movies.map((movie) => (
            <MovieCard key={movie.id} {...movie} isUpcoming={true} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {movies.map((movie) => (
            <MovieCard key={movie.id} {...movie} />
          ))}
        </div>
      )}
    </section>
  );
};

export default MovieSection;
