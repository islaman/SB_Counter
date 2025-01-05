import React from 'react';

export const Card = ({ children, className }) => (
  <div className={`p-4 rounded-lg shadow-md bg-white ${className || ''}`}>
    {children}
  </div>
);

export const CardHeader = ({ children, className }) => (
  <div className={`border-b pb-2 mb-2 ${className || ''}`}>
    {children}
  </div>
);

export const CardTitle = ({ children, className }) => (
  <h3 className={`text-lg font-bold ${className || ''}`}>
    {children}
  </h3>
);

export const CardContent = ({ children, className }) => (
  <div className={`text-gray-700 ${className || ''}`}>
    {children}
  </div>
);
