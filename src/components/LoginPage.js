import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // تسجيل الدخول باستخدام Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      // إذا نجحت عملية تسجيل الدخول، توجيه المستخدم إلى صفحة الإدارة
      alert('تم تسجيل الدخول بنجاح!');
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'حدث خطأ أثناء تسجيل الدخول.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#141517] via-[#1e2024] to-[#3c4043] font-tajawal text-white">
      {/* Header Section */}
      <header className="flex justify-between items-center bg-transparent backdrop-blur-md text-white p-4 sm:p-6 shadow-xl">
        <div className="flex items-center gap-2 sm:gap-4">
          <img src="/logo.png" alt="Logo" className="w-8 h-8 sm:w-12 sm:h-12 rounded-full shadow-lg" />
          <h1 className="text-lg sm:text-2xl font-bold">تسجيل الدخول</h1>
        </div>
      </header>

      {/* Login Form Section */}
      <section className="max-w-md mx-auto my-8 sm:my-16 p-6 sm:p-8 bg-[#2b2f38] rounded-lg shadow-lg backdrop-blur-md text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#3ab9f1] mb-6 sm:mb-8">تسجيل دخول الإداريين</h2>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm sm:text-base mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-gray-300 text-sm sm:text-base mb-2">
              البريد الإلكتروني:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 sm:py-3 text-white bg-[#23272e] rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-[#3ab9f1]"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-gray-300 text-sm sm:text-base mb-2">
              كلمة المرور:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 sm:py-3 text-white bg-[#23272e] rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-[#3ab9f1]"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-6 py-2 sm:py-3 bg-gradient-to-r from-[#3ab9f1] to-[#1e90ff] text-white rounded-lg shadow-md hover:shadow-lg transition-shadow text-sm sm:text-lg"
          >
            تسجيل الدخول
          </button>
        </form>
      </section>
    </div>
  );
};

export default LoginPage;