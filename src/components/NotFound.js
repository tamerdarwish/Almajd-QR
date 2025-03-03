import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';

const NotFound = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  // دالة لتغيير اللغة
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng); // تغيير اللغة باستخدام i18n
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#141517] via-[#1e2024] to-[#3c4043] font-tajawal text-white">
      {/* Header Section */}
      <header className="flex justify-between items-center bg-transparent backdrop-blur-md text-white p-4 sm:p-6 shadow-xl">
        <div className="flex items-center gap-2 sm:gap-4">
          <img src="/logo.png" alt="Logo" className="w-8 h-8 sm:w-12 sm:h-12 rounded-full shadow-lg" />
          <h1 className="text-lg sm:text-2xl font-bold">{t('appName')}</h1>
        </div>

        {/* Language Switcher */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => changeLanguage('ar')}
            className={`text-sm sm:text-base font-medium ${
              i18n.language === 'ar' ? 'text-[#3ab9f1]' : 'text-gray-400 hover:text-white'
            } transition-colors`}
          >
            العربية
          </button>
          <button
            onClick={() => changeLanguage('he')}
            className={`text-sm sm:text-base font-medium ${
              i18n.language === 'he' ? 'text-[#3ab9f1]' : 'text-gray-400 hover:text-white'
            } transition-colors`}
          >
            עברית
          </button>
         
        </div>
      </header>

      {/* Not Found Section */}
      <section className="max-w-5xl mx-auto my-8 sm:my-16 p-6 sm:p-8 bg-[#2b2f38] rounded-lg shadow-lg backdrop-blur-md text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-[#ff4d4d] mb-6 sm:mb-8">
          404 - {t('pageNotFound')}
        </h1>
        <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8">
          {t('lostYourWay')}
        </p>
        <button
          onClick={() => navigate('/')} // العودة إلى الصفحة الرئيسية
          className="px-6 py-3 bg-gradient-to-r from-[#3ab9f1] to-[#1e90ff] text-white rounded-lg shadow-md hover:shadow-lg transition-shadow text-lg sm:text-xl"
        >
          {t('backToHome')}
        </button>
      </section>
    </div>
  );
};

export default NotFound;