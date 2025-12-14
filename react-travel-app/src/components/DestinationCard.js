import React from 'react';
import { MapPin, Star, Heart } from 'lucide-react';

const DestinationCard = ({ destination, onSelect }) => {
  const [isFavorite, setIsFavorite] = React.useState(false);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
      onClick={() => onSelect && onSelect(destination)}
    >
      <div className="relative h-48 bg-gradient-to-br from-purple-400 to-blue-500">
        {destination.image ? (
          <img 
            src={destination.image} 
            alt={destination.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.style.background = 'linear-gradient(to bottom right, #9F7AEA, #4299E1)';
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <MapPin className="w-16 h-16 text-white opacity-50" />
          </div>
        )}
        
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:scale-110 transition-transform"
        >
          <Heart 
            className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
          />
        </button>

        {destination.category && (
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-purple-600">
            {destination.category}
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{destination.name}</h3>
        
        {destination.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {destination.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          {destination.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium text-gray-700">{destination.rating}</span>
            </div>
          )}
          
          <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
            Learn More →
          </button>
        </div>
      </div>
    </div>
  );
};

export default DestinationCard;
