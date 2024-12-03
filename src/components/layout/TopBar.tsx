import { FC } from 'react';

export const TopBar: FC = () => {
  return (
    <div className="bg-primary text-primary-foreground p-2 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <svg
          width="24"
          height="24"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-primary-foreground"
        >
          <rect x="6" y="8" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
          <path d="M6 14H26" stroke="currentColor" strokeWidth="2" />
          <circle cx="11" cy="19" r="2" fill="currentColor" />
          <circle cx="21" cy="19" r="2" fill="currentColor" />
        </svg>
        <span className="text-base font-bold">CLUB PILOT</span>
      </div>
    </div>
  );
};