
import React from 'react';

export const LogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    >
    <path 
        d="M8 3H5C3.89543 3 3 3.89543 3 5V8" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="opacity-60"
    />
    <path 
        d="M16 3H19C20.1046 3 21 3.89543 21 5V8" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="opacity-60"
    />
    <path 
        d="M8 21H5C3.89543 21 3 20.1046 3 19V16" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="opacity-60"
    />
    <path 
        d="M16 21H19C20.1046 21 21 20.1046 21 19V16" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="opacity-60"
    />
    <path 
        d="M9 12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12Z" 
        stroke="currentColor" 
        strokeWidth="2"
    />
    <path 
        d="M12 9V3" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round"
    />
    <path 
        d="M12 21V15" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round"
    />
    </svg>
);