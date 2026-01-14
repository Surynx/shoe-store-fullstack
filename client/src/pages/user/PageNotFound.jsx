import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-lg w-full">
        
        {/* Left Side: The Sad Face */}
        <div className="relative flex-shrink-0">
          <div className="absolute inset-0 bg-gray-100 rounded-full scale-105 transform translate-y-1"></div>
          
          {/* Drastically reduced icon size to w-20 (80px) */}
          <svg
            className="relative z-10 w-20 h-20 text-slate-900"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
            <line x1="9" x2="9.01" y1="9" y2="9" />
            <line x1="15" x2="15.01" y1="9" y2="9" />
          </svg>
        </div>

        {/* Right Side: Text Content */}
        <div className="text-center md:text-left space-y-1 z-10">
          {/* Reduced Title to text-4xl */}
          <h1 className="text-4xl font-bold text-slate-900 tracking-tighter">
            404
          </h1>
          {/* Reduced Subtitle to text-sm */}
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
            Oops! Page not be found
          </h2>
          {/* Reduced Description to text-xs */}
          <p className="text-gray-500 text-xs max-w-[200px] md:max-w-xs mx-auto md:mx-0">
            Sorry but the page you are looking for does not exist.
          </p>
          <div className="pt-2">
            <Link
              to="/"
              className="text-blue-500 text-xs font-semibold hover:text-blue-700 transition-colors duration-200"
            >
              Back to homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;