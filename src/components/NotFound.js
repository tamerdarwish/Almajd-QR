import React from 'react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-[#141517] via-[#1e2024] to-[#3c4043] font-tajawal text-white">
      {/* Header Section */}
      <header className="flex justify-between items-center bg-transparent backdrop-blur-md text-white p-4 sm:p-6 shadow-xl">
        <div className="flex items-center gap-2 sm:gap-4">
          <img src="/logo.png" alt="Logo" className="w-8 h-8 sm:w-12 sm:h-12 rounded-full shadow-lg" />
        </div>
      </header>

      {/* Not Found Section */}
      <section className="max-w-5xl mx-auto my-8 sm:my-16 p-6 sm:p-8 bg-[#2b2f38] rounded-lg shadow-lg backdrop-blur-md text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-[#ff4d4d] mb-6 sm:mb-8">404 - الصفحة غير موجودة!</h1>
        <p className="text-lg sm:text-xl text-gray-300">
          يبدو أنك فقدت الطريق. يرجى التحقق من الرابط الذي أدخلته.
        </p>
      </section>
    </div>
  );
};

export default NotFound;