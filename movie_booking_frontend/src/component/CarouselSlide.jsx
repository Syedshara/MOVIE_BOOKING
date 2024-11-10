import React from 'react';
import { Carousel } from "flowbite-react";

const CarouselSlide = () => {
    return (
        <div className="h-56 sm:h-64 xl:h-80 2xl:h-96 relative">
            <Carousel slideInterval={5000}>
                {/* Full-width blurred image */}
                <div className="relative w-full h-full ">
                    <img
                        src="https://www.hindustantimes.com/ht-img/img/2024/02/23/550x309/Crakk_movie_review_1708665608923_1708665609147.jpeg"
                        alt="..."
                        className="w-full h-full object-cover md:blur-sm"
                    />
                    {/* Smaller clear image overlaying the blurred background */}
                    <div className="absolute top-0 hidden md:inline left-1/4 right-1/4 ">
                        <img
                            src="https://www.hindustantimes.com/ht-img/img/2024/02/23/550x309/Crakk_movie_review_1708665608923_1708665609147.jpeg"
                            alt="..."
                            className="w-full h-full  object-cover"
                        />
                    </div>
                </div>

                {/* Repeat for other slides */}
                <div className="relative w-full h-full">
                    <img
                        src="https://img.etimg.com/thumb/width-1600,height-900,imgsize-1162944,resizemode-75,msid-112640572/magazines/panache/thangalaan-ott-release-when-and-where-to-watch-vikrams-latest-period-drama-movie-check-details.jpg"
                        alt="..."
                        className="w-full h-full object-cover  lg:blur-sm"
                    />
                    <div className="absolute top-0 lg:left-1/4 lg:right-1/4 ">
                        <img
                            src="https://img.etimg.com/thumb/width-1600,height-900,imgsize-1162944,resizemode-75,msid-112640572/magazines/panache/thangalaan-ott-release-when-and-where-to-watch-vikrams-latest-period-drama-movie-check-details.jpg"
                            alt="..."
                            className="w-full h-auto object-cover"
                        />
                    </div>
                </div>

                <div className="relative w-full h-full">
                    <img
                        src="https://img.etimg.com/thumb/width-1600,height-900,imgsize-1162944,resizemode-75,msid-112640572/magazines/panache/thangalaan-ott-release-when-and-where-to-watch-vikrams-latest-period-drama-movie-check-details.jpg"
                        alt="..."
                        className="w-full h-full object-cover lg:blur-sm"
                    />
                    <div className="absolute top-0 lg:left-1/4 lg:right-1/4 ">
                        <img
                            src="https://img.etimg.com/thumb/width-1600,height-900,imgsize-1162944,resizemode-75,msid-112640572/magazines/panache/thangalaan-ott-release-when-and-where-to-watch-vikrams-latest-period-drama-movie-check-details.jpg"
                            alt="..."
                            className="w-full h-auto object-cover"
                        />
                    </div>
                </div>

                <div className="relative w-full h-full">
                    <img
                        src="https://img.etimg.com/thumb/width-1600,height-900,imgsize-1162944,resizemode-75,msid-112640572/magazines/panache/thangalaan-ott-release-when-and-where-to-watch-vikrams-latest-period-drama-movie-check-details.jpg"
                        alt="..."
                        className="w-full h-full object-cover lg:blur-sm"
                    />
                    <div className="absolute top-0 lg:left-1/4 lg:right-1/4 ">
                        <img
                            src="https://img.etimg.com/thumb/width-1600,height-900,imgsize-1162944,resizemode-75,msid-112640572/magazines/panache/thangalaan-ott-release-when-and-where-to-watch-vikrams-latest-period-drama-movie-check-details.jpg"
                            alt="..."
                            className="w-full h-auto object-cover"
                        />
                    </div>
                </div>

            </Carousel>
        </div>
    );
};

export default CarouselSlide;