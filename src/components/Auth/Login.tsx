import React, { useState } from 'react';
import { Lock, Calculator, Shield, TrendingUp, AlertCircle, Eye, EyeOff, X, User } from 'lucide-react';
import { authenticateUser, DEMO_USERS } from '../../utils/multiUserUnifiedData';
import { Button } from '../common/Button';
import { PayLockrLogo } from '../common/Logo';

interface LoginProps {
  onLogin: () => void;
  onNavigateToSignup: () => void;
  isDarkMode: boolean;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onNavigateToSignup, isDarkMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));

    const user = authenticateUser(email, password);
    if (user) {
      sessionStorage.setItem('userData', JSON.stringify(user));
      onLogin();
    } else {
      setError('Invalid credentials. Please try again.');
      setIsLoading(false);
    }
  };

  const loginAs = (userId: string) => {
    const user = DEMO_USERS.find(u => u.id === userId);
    if (user) {
      // Simulate OAuth login instantly
      sessionStorage.setItem('userData', JSON.stringify(user));
      onLogin();
    }
  };

  return (
    <div className={`min-h-screen flex ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
      {/* Left Side - Branding */}
      <div className={`hidden lg:flex lg:w-1/2 ${isDarkMode ? 'bg-gray-900 border-r-4 border-yellow-400' : 'bg-black'} p-12 flex-col justify-between`}>
        <div>
          <div className="flex items-center gap-3 mb-8">
            <PayLockrLogo size={48} />  
            <span className="text-3xl font-black uppercase text-white">PAYLOCKR</span>
          </div>
          <h1 className="text-4xl font-black uppercase text-white mb-4 leading-tight">
            AUTOMATE YOUR TAX<br />SAVINGS EFFORTLESSLY
          </h1>
          <p className="text-sm font-bold uppercase tracking-wider text-gray-500 leading-relaxed">
            REAL-TIME TAX CALCULATION AND AUTOMATIC VAULTING
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-start gap-4 border-l-4 border-yellow-400 pl-4">
            <Calculator className="w-8 h-8 text-yellow-400" />
            <div>
              <h3 className="text-white font-black text-sm uppercase mb-1">REAL-TIME TAX CALCULATION</h3>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">INSTANT TAX ESTIMATION</p>
            </div>
          </div>
          <div className="flex items-start gap-4 border-l-4 border-cyan-500 pl-4">
            <Shield className="w-8 h-8 text-cyan-400" />
            <div>
              <h3 className="text-white font-black text-sm uppercase mb-1">AUTOMATIC TAX VAULTING</h3>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">MONEY RESERVED SAFELY</p>
            </div>
          </div>
          <div className="flex items-start gap-4 border-l-4 border-green-500 pl-4">
            <TrendingUp className="w-8 h-8 text-green-400" />
            <div>
              <h3 className="text-white font-black text-sm uppercase mb-1">SMART INSIGHTS</h3>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">AI-POWERED RECOMMENDATIONS</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 justify-center mb-8">
            <PayLockrLogo size={40} />
            <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>PayLockr</span>
          </div>

          <div className="mb-8">
            <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
              Welcome back
            </h2>
            <p className={`${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
              Sign in to continue to PayLockr
            </p>
          </div>

          {error && (
            <div className={`mb-6 p-4 rounded-lg border ${isDarkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'} flex items-start gap-3`}>
              <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
              <p className={`text-sm ${isDarkMode ? 'text-red-300' : 'text-red-800'}`}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-3 pr-12 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-400 hover:text-slate-300' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className={`w-5 h-5 border-2 rounded ${
                    isDarkMode ? 'border-slate-600 bg-slate-800' : 'border-gray-300 bg-white'
                  } peer-checked:bg-blue-600 peer-checked:border-blue-600 peer-focus:ring-2 peer-focus:ring-blue-500 peer-focus:ring-offset-2 transition-all flex items-center justify-center`}>
                    {rememberMe && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className={`text-sm select-none ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                  Remember me
                </span>
              </label>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              isLoading={isLoading}
              className="w-full"
            >
              Sign In
            </Button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1"></div>
            <span className="text-sm text-slate-500 dark:text-slate-400">OR</span>
            <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1"></div>
          </div>

          <button
            onClick={() => setShowGoogleModal(true)}
            className={`w-full py-3 rounded-lg border flex items-center justify-center gap-3 transition-colors ${
              isDarkMode 
                ? 'bg-white text-slate-900 hover:bg-slate-100 border-transparent' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span className="font-semibold">Sign in with Google</span>
          </button>

          <div className="mt-6 text-center">
            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
              Don't have an account?{' '}
              <button
                onClick={onNavigateToSignup}
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Google Account Chooser Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-black border-4 border-yellow-400 w-full max-w-md overflow-hidden animate-fade-in-up">
             <div className="p-6 border-b-4 border-gray-800 flex justify-between items-center">
               <div>
                 <h3 className="text-xl font-black uppercase text-white">CHOOSE AN ACCOUNT</h3>
                 <p className="text-xs font-bold uppercase text-gray-500">TO CONTINUE TO PAYLOCKR</p>
               </div>
               <button onClick={() => setShowGoogleModal(false)} className="text-gray-400 hover:text-white">
                 <X size={20} />
               </button>
             </div>
             <div className="p-2 space-y-1">
               {DEMO_USERS.map(user => (
                 <button key={user.id} onClick={() => loginAs(user.id)} className="w-full flex items-center gap-4 p-4 hover:bg-gray-900 transition text-left group">
                    <div className={`w-10 h-10 flex items-center justify-center font-black text-lg ${
                      user.id === 'saiyam' ? 'bg-cyan-500 text-black' : 'bg-yellow-400 text-black'
                    }`}>
                      {user.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-black uppercase text-white group-hover:text-cyan-400 transition-colors">{user.name}</p>
                      <p className="text-xs font-bold uppercase text-gray-500">{user.email}</p>
                    </div>
                 </button>
               ))}
               <button className="w-full flex items-center gap-4 p-4 hover:bg-gray-900 transition text-left group">
                  <div className="w-10 h-10 bg-gray-800 flex items-center justify-center text-white">
                    <User size={20} />
                  </div>
                  <p className="font-black uppercase text-white group-hover:text-cyan-400 transition-colors">USE ANOTHER ACCOUNT</p>
               </button>
             </div>
             <div className="p-4 bg-gray-900 border-t-4 border-gray-800 text-center">
                <p className="text-xs font-bold uppercase text-gray-500">
                  TO CONTINUE, GOOGLE WILL SHARE YOUR NAME, EMAIL ADDRESS, AND LANGUAGE PREFERENCE WITH PAYLOCKR.
                </p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};