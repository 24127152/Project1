import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                VietNam UrbanQuest
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/recommend" className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium">
              Recommendations
            </Link>
            <Link to="/recognize" className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium">
              Recognize
            </Link>
            <Link to="/albums" className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium">
              Albums
            </Link>
            
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium">
                  Login
                </Link>
                <Link to="/signup" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
