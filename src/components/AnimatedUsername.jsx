import React from 'react';

const AnimatedUsername = ({ username, domain }) => {
  return (
    <div className="font-mono text-lg font-semibold relative group">
      <span className="text-gray-900">{domain}/{username}</span>
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
    </div>
  );
};

export default AnimatedUsername;