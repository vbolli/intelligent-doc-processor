import React from 'react';

export const JsonIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9 4C7 6 7 10 9 12C7 14 7 18 9 20" />
    <path d="M15 4C17 6 17 10 15 12C17 14 17 18 15 20" />
  </svg>
);