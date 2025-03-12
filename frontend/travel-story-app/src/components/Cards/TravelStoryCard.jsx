import moment from "moment/moment";
import React from 'react';
import { FaHeart } from "react-icons/fa6";
import { GrMapLocation } from "react-icons/gr";

const TravelStoryCard = ({ 
    imgUrl,
    title,
    date,
    story,
    visitedLocation = [], // Ensure it's an array
    isFavourite,
    onFavouriteClick,
    onClick, 
}) => {
    console.log("Image URL in TravelStoryCard:", imgUrl); // Debugging step

    return (
        <div className="border rounded-lg overflow-hidden bg-white hover:shadow-lg hover:shadow-slate-200 transition-all ease-in-out relative cursor-pointer">
            <img
                src={imgUrl || "https://via.placeholder.com/150"} // Fallback for debugging
                alt={title}
                className="w-full h-56 object-cover rounded-lg"
                onClick={onClick}
            />

            <button
                className="w-12 h-12 flex items-center justify-center bg-white/40 rounded-lg border border-white/30 absolute top-4 right-4"
                onClick={onFavouriteClick}
            >
                <FaHeart className={`icon-btn ${isFavourite ? "text-red-500" : "text-white"}`} />
            </button>

            <div className="p-4" onClick={onClick}> {/* Fixed 'onclick' typo */}
                <div className="flex items-center gap-3">
                    <div className="flex-1">
                        <h6 className="text-sm font-medium">{title}</h6>
                        <span className="text-xs text-slate-500">
                            {date ? moment(date).format("Do MM YYYY") : "-"}
                        </span>
                    </div>
                </div>

                <p className="text-xs text-slate-600 mt-2">{story?.slice(0, 60)}</p>

                {visitedLocation.length > 0 && (
                    <div className="inline-flex items-center gap-2 text-[13px] text-cyan-600 bg-cyan-200/40 rounded mt-3 px-2 py-1">
                        <GrMapLocation className="text-sm" />
                        {visitedLocation.join(", ")}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TravelStoryCard;
