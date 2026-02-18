// Simple animation utilities for better UX

export const fadeIn = {
  animation: 'fadeIn 0.3s ease-in'
};

export const slideUp = {
  animation: 'slideUp 0.4s ease-out'
};

export const pulse = {
  animation: 'pulse 2s infinite'
};

export const shimmer = {
  animation: 'shimmer 2s infinite'
};

// Add to global CSS
export const animationStyles = `
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-in;
}

.animate-slide-up {
  animation: slideUp 0.4s ease-out;
}

.animate-pulse-slow {
  animation: pulse 2s infinite;
}

.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
}

.dark .skeleton {
  background: linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%);
  background-size: 1000px 100%;
}
`;
