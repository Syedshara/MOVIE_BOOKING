import React from 'react';
import { Carousel } from 'flowbite-react';

const CarouselSlide = ({ movies }) => {
    return (
        <div className="h-56 sm:h-64 xl:h-80 2xl:h-96 relative">
            <Carousel slideInterval={5000}>
                {movies.slice(0, 4).map((movie) => ( // Display first 4 movies in carousel
                    <div className="relative w-full h-full" key={movie.movie_id}>
                        <img
                            src={movie.background_url}
                            alt={movie.movie_name}
                            className="w-full h-full object-cover md:blur-sm"
                        />
                        <div className="absolute top-0 hidden md:inline left-1/4 right-1/4 ">
                            <img
                                src={movie.background_url}
                                alt={movie.movie_name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export default CarouselSlide;
