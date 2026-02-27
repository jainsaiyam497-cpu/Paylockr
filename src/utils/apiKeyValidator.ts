export const quickValidateKeys = () => {
  const keys = {
    gemini: import.meta.env.VITE_GEMINI_API_KEY,
    groq: import.meta.env.VITE_GROQ_API_KEY,
    emailjs: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
    supabase: import.meta.env.VITE_SUPABASE_URL,
  };

  console.log('🔑 API Key Status:');
  Object.entries(keys).forEach(([name, key]) => {
    const status = key && !key.includes('your_') ? '✅' : '❌';
    console.log(`${status} ${name}: ${key ? 'Present' : 'Missing'}`);
  });
};

export const validateAllAPIKeys = async () => {
  return [
    {
      name: 'Gemini API',
      key: import.meta.env.VITE_GEMINI_API_KEY ? 'Present' : 'Missing',
      status: import.meta.env.VITE_GEMINI_API_KEY ? 'valid' : 'missing'
    },
    {
      name: 'Groq API', 
      key: import.meta.env.VITE_GROQ_API_KEY ? 'Present' : 'Missing',
      status: import.meta.env.VITE_GROQ_API_KEY ? 'valid' : 'missing'
    }
  ];
};