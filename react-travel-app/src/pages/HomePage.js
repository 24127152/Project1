import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="hero-bg text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 centaur-font">
            Discover Vietnam
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Your AI-powered travel companion for exploring Vietnam's wonders
          </p>
          <div className="space-x-4">
            <button
              onClick={() => navigate('/recommend')}
              className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Get Recommendations
            </button>
            <button
              onClick={() => navigate('/recognize')}
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition"
            >
              Recognize Landmarks
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="feature-card bg-white p-6 rounded-lg card-shadow">
            <div className="text-4xl mb-4">🗺️</div>
            <h3 className="text-xl font-bold mb-2">AI Recommendations</h3>
            <p className="text-gray-600">
              Get personalized travel recommendations based on your preferences
            </p>
          </div>

          <div className="feature-card bg-white p-6 rounded-lg card-shadow">
            <div className="text-4xl mb-4">📸</div>
            <h3 className="text-xl font-bold mb-2">Landmark Recognition</h3>
            <p className="text-gray-600">
              Upload photos and discover information about Vietnamese landmarks
            </p>
          </div>

          <div className="feature-card bg-white p-6 rounded-lg card-shadow">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-bold mb-2">Travel Albums</h3>
            <p className="text-gray-600">
              Create and organize your travel memories in beautiful albums
            </p>
          </div>
        </div>
      </div>

      {/* Popular Destinations */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Destinations</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['Hà Nội', 'Hạ Long', 'Hội An', 'Sapa', 'TP.HCM', 'Phú Quốc'].map((city) => (
              <div key={city} className="feature-card overflow-hidden rounded-lg card-shadow">
                <div className="h-48 bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">{city}</span>
                </div>
                <div className="p-4">
                  <button
                    onClick={() => navigate('/recommend')}
                    className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
                  >
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
