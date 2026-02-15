import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-6 text-center text-sm text-slate-500 dark:text-slate-400 border-t dark:border-slate-800 mt-auto">
      <p>© {new Date().getFullYear()} PayLockr. All rights reserved.</p>
    </footer>
  );
};