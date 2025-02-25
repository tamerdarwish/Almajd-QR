import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Album = ({ events, files }) => {
  const [accessCode, setAccessCode] = useState('');
  const [event, setEvent] = useState(null);
  const { t, i18n } = useTranslation();

  // دالة لتغيير اللغة
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const handleAccessCodeSubmit = () => {
    const foundEvent = events.find((e) => e.access_code === accessCode);
    if (foundEvent) {
      setEvent(foundEvent);
    } else {
      alert(t('invalidCode'));
    }
  };

  if (event) {
    const eventFiles = files.filter((file) => file.event_id === event.id);
    return (
      <div className="min-h-screen bg-gradient-to-r from-[#141517] via-[#1e2024] to-[#3c4043] font-tajawal text-white">
        {/* Header Section */}
        <header className="flex justify-between items-center bg-transparent backdrop-blur-md text-white p-4 sm:p-6 shadow-xl">
          <div className="flex items-center gap-2 sm:gap-4">
            <img src="/logo.png" alt="Logo" className="w-8 h-8 sm:w-12 sm:h-12 rounded-full shadow-lg" />
            <h1 className="text-lg sm:text-2xl font-bold">{t('album')}</h1>
          </div>

          {/* Language Switcher */}
          <div className="relative">
            <button
              className="px-4 py-2 bg-gradient-to-r from-[#3ab9f1] to-[#1e90ff] text-white rounded-lg shadow-md hover:shadow-lg transition-shadow text-sm sm:text-lg"
              onClick={() => document.getElementById('language-menu').classList.toggle('hidden')}
            >
              {i18n.language === 'ar' ? 'العربية' : 'עברית'}
            </button>

            {/* Dropdown Menu */}
            <div
              id="language-menu"
              className="absolute top-full right-0 mt-2 w-32 bg-[#2b2f38] rounded-lg shadow-lg hidden"
            >
              <button
                onClick={() => changeLanguage('ar')}
                className="block w-full text-right px-4 py-2 text-gray-300 hover:bg-[#3ab9f1] hover:text-white rounded-t-lg transition-colors"
              >
                العربية
              </button>
              <button
                onClick={() => changeLanguage('he')}
                className="block w-full text-right px-4 py-2 text-gray-300 hover:bg-[#3ab9f1] hover:text-white rounded-b-lg transition-colors"
              >
                עברית
              </button>
            </div>
          </div>
        </header>

        {/* Event Gallery Section */}
        <section className="max-w-6xl mx-auto my-8 sm:my-16 p-6 sm:p-8 bg-[#2b2f38] rounded-lg shadow-lg backdrop-blur-md">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#3ab9f1] mb-6 sm:mb-8">
            {t('eventAlbum', { name: event.name })}
          </h2>

          {/* Gallery Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {eventFiles.map((file) => (
              <div
                key={file.id}
                className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                {/* File Preview */}
                <div className="relative w-full h-48 sm:h-64">
                  {file.file_type === 'image' ? (
                    <img
                      src={file.file_url}
                      alt={file.file_name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <video
                      controls
                      className="w-full h-full object-cover"
                    >
                      <source src={file.file_url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#141517] via-[#1e2024] to-[#3c4043] font-tajawal text-white">
      {/* Header Section */}
      <header className="flex justify-between items-center bg-transparent backdrop-blur-md text-white p-4 sm:p-6 shadow-xl">
        <div className="flex items-center gap-2 sm:gap-4">
          <img src="/logo.png" alt="Logo" className="w-8 h-8 sm:w-12 sm:h-12 rounded-full shadow-lg" />
          <h1 className="text-lg sm:text-2xl font-bold">{t('viewAlbum')}</h1>
        </div>

        {/* Language Switcher */}
        <div className="relative">
          <button
            className="px-4 py-2 bg-gradient-to-r from-[#3ab9f1] to-[#1e90ff] text-white rounded-lg shadow-md hover:shadow-lg transition-shadow text-sm sm:text-lg"
            onClick={() => document.getElementById('language-menu').classList.toggle('hidden')}
          >
            {i18n.language === 'ar' ? 'العربية' : 'עברית'}
          </button>

          {/* Dropdown Menu */}
          <div
            id="language-menu"
            className="absolute top-full right-0 mt-2 w-32 bg-[#2b2f38] rounded-lg shadow-lg hidden"
          >
            <button
              onClick={() => changeLanguage('ar')}
              className="block w-full text-right px-4 py-2 text-gray-300 hover:bg-[#3ab9f1] hover:text-white rounded-t-lg transition-colors"
            >
              العربية
            </button>
            <button
              onClick={() => changeLanguage('he')}
              className="block w-full text-right px-4 py-2 text-gray-300 hover:bg-[#3ab9f1] hover:text-white rounded-b-lg transition-colors"
            >
              עברית
            </button>
          </div>
        </div>
      </header>

      {/* Access Code Section */}
      <section className="max-w-5xl mx-auto my-8 sm:my-16 p-6 sm:p-8 bg-[#2b2f38] rounded-lg shadow-lg backdrop-blur-md text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#3ab9f1] mb-6 sm:mb-8">
          {t('viewAlbum')}
        </h2>
        <input
          type="text"
          placeholder={t('enterAccessCode')}
          value={accessCode}
          onChange={(e) => setAccessCode(e.target.value)}
          className="w-full px-4 py-2 sm:py-3 text-white bg-[#23272e] rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-[#3ab9f1] mb-4"
        />
        <button
          onClick={handleAccessCodeSubmit}
          className="px-6 py-2 sm:py-3 bg-gradient-to-r from-[#3ab9f1] to-[#1e90ff] text-white rounded-lg shadow-md hover:shadow-lg transition-shadow text-sm sm:text-lg"
        >
          {t('submit')}
        </button>
      </section>
    </div>
  );
};

export default Album;