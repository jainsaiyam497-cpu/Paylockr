import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';

interface APIKeyStatus {
  name: string;
  key: string;
  status: 'valid' | 'invalid' | 'missing' | 'testing';
  error?: string;
}

export const APIKeyChecker: React.FC = () => {
  const [results, setResults] = useState<APIKeyStatus[]>([]);
  const [testing, setTesting] = useState(false);

  const testAllKeys = async () => {
    setTesting(true);
    const keys = [
      { name: 'Gemini API', key: import.meta.env.VITE_GEMINI_API_KEY },
      { name: 'Groq API', key: import.meta.env.VITE_GROQ_API_KEY },
      { name: 'EmailJS', key: import.meta.env.VITE_EMAILJS_PUBLIC_KEY },
      { name: 'Supabase', key: import.meta.env.VITE_SUPABASE_URL },
    ];

    const keyResults = keys.map(({ name, key }) => ({
      name,
      key: key ? key.substring(0, 10) + '...' : 'Missing',
      status: (key && !key.includes('your_')) ? 'valid' : 'missing' as const
    }));

    setResults(keyResults);
    setTesting(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'invalid': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'missing': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  useEffect(() => {
    console.log('🔑 API Keys Check:');
    console.log('Gemini:', import.meta.env.VITE_GEMINI_API_KEY ? '✅' : '❌');
    console.log('Groq:', import.meta.env.VITE_GROQ_API_KEY ? '✅' : '❌');
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-black border-2 border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black uppercase text-black dark:text-white">🔑 API Key Checker</h2>
          <button
            onClick={testAllKeys}
            disabled={testing}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-black font-bold uppercase transition"
          >
            {testing ? 'TESTING...' : 'TEST KEYS'}
          </button>
        </div>

        {results.length > 0 && (
          <div className="space-y-4">
            {results.map((result, index) => (
              <div key={index} className="border-l-4 border-cyan-500 p-4 bg-gray-50 dark:bg-gray-900">
                <div className="flex items-center gap-3">
                  {getStatusIcon(result.status)}
                  <div>
                    <h3 className="font-black text-black dark:text-white">{result.name}</h3>
                    <p className="text-xs text-gray-500">{result.key}</p>
                  </div>
                  <span className={`ml-auto px-2 py-1 text-xs font-bold uppercase ${
                    result.status === 'valid' ? 'bg-green-500 text-black' : 'bg-yellow-500 text-black'
                  }`}>
                    {result.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};