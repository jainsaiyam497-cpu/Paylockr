import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-6 text-center bg-black border-t-4 border-yellow-400 mt-8">
      <p className="text-xs font-bold uppercase tracking-wider text-gray-500">© {new Date().getFullYear()} PAYLOCKR. ALL RIGHTS RESERVED.</p>
    </footer>
  );
};