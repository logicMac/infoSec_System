// NotFound404.jsx
import React from "react";
import { Link } from "react-router-dom"; // if you use react-router

function NotFound404() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-9xl font-extrabold text-gray-800 mb-4">404</h1>
      <p className="text-2xl text-gray-600 mb-6">
        Oops! The page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
      >
        Go Back Home
      </Link>
      <div className="mt-10">
        <img
          src="https://i.imgur.com/qIufhof.png"
          alt="404 illustration"
          className="w-64 md:w-96"
        />
      </div>
    </div>
  );
}

export default NotFound404;