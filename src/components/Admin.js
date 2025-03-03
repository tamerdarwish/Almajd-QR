import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import QRCode from 'qrcode'; // إضافة مكتبة QRCode
import { jsPDF } from 'jspdf';
import { Canvg } from 'canvg';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // إضافة useTranslation

const Admin = ({ events }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [eventName, setEventName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // حالة جديدة للبحث
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(); // استخدام useTranslation

  // دالة لتغيير اللغة
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          navigate('/login');
        } else {
          setSession(data.session);
        }
      } catch (error) {
        console.error('حدث خطأ أثناء التحقق من الجلسة:', error.message);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, [navigate]);

  if (loading) {
    return <p className="text-center text-lg text-gray-300">{t('loading')}</p>;
  }

  const handleCreateEvent = async () => {
    if (!eventName.trim() || eventName.length < 3) {
      setErrorMessage(t('eventNameTooShort'));
      return;
    }
  
    try {
      const barcode = Math.random().toString(36).substr(2, 9);
      const accessCode = Math.random().toString(36).substr(2, 6);
  
      const { data, error } = await supabase
        .from('events')
        .insert([{ name: eventName, barcode: barcode, access_code: accessCode }]);
  
      if (error) {
        console.error('حدث خطأ أثناء إنشاء المناسبة:', error.message);
        setErrorMessage(t('eventCreationError'));
        return;
      }
  
      alert(t('eventCreated')); // أو استخدم مكتبة لإظهار الرسائل
      setEventName('');
      setErrorMessage('');
    } catch (error) {
      console.error('حدث خطأ أثناء إنشاء المناسبة:', error.message);
      setErrorMessage(t('eventCreationError'));
    }
  };

  const generateBarcodeAndDownload = async (barcode, eventName) => {
    setIsDownloading(true);
    try {
      const url = `${process.env.REACT_APP_FRONTEND_URL}/upload/${barcode}`;

      // توليد QR كود باستخدام مكتبة qrcode
      const qrCodeDataUrl = await QRCode.toDataURL(url);

      // إنشاء ملف PDF وحفظه
      const pdf = new jsPDF();
      pdf.text(`${t('eventName')}: ${eventName}`, 10, 10);
      pdf.addImage(qrCodeDataUrl, 'PNG', 50, 20, 100, 100); // إضافة صورة QR كود
      pdf.save(`${eventName}-qrcode.pdf`);
    } catch (error) {
      console.error('حدث خطأ أثناء تحميل QR كود:', error.message);
      alert(t('qrCodeDownloadError'));
    } finally {
      setIsDownloading(false);
    }
  };

  // تصفية المناسبات بناءً على النص المدخل
  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#141517] via-[#1e2024] to-[#3c4043] font-tajawal text-white">
      {/* Header Section */}
      <header className="flex justify-between items-center bg-transparent backdrop-blur-md text-white p-4 sm:p-6 shadow-xl">
        {/* Logout Button */}
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            navigate('/login');
          }}
          className="flex items-center gap-2 text-sm sm:text-lg font-medium hover:text-gray-400 transition-all"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 sm:h-6 sm:w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          {t('logout')}
        </button>

        {/* Logo and Title */}
        <div className="flex items-center gap-2 sm:gap-4">
          <img src="/logo.png" alt="Logo" className="w-8 h-8 sm:w-12 sm:h-12 rounded-full shadow-lg" />
          <h1 className="text-lg sm:text-2xl font-bold">{t('adminDashboard')}</h1>
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

      {/* Create Event Form Section */}
      <section className="max-w-3xl mx-auto my-8 sm:my-16 p-6 sm:p-8 bg-[#2b2f38] rounded-lg shadow-lg backdrop-blur-md">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#3ab9f1] mb-6 sm:mb-8">
          {t('createNewEvent')}
        </h2>
        <form className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <input
              type="text"
              placeholder={t('enterEventName')}
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="flex-grow px-4 py-2 sm:py-3 rounded-lg bg-[#1e1e24] text-base sm:text-lg text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#3ab9f1]"
            />
            <button
              onClick={handleCreateEvent}
              className="px-6 py-2 sm:px-8 sm:py-3 bg-[#3ab9f1] text-white rounded-lg hover:bg-[#2a9fd6] transition-colors text-base sm:text-lg"
            >
              {t('create')}
            </button>
          </div>
          {errorMessage && (
            <div className="flex items-center gap-2 text-red-500 text-sm sm:text-base">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 sm:h-5 sm:w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              {errorMessage}
            </div>
          )}
        </form>
      </section>

      {/* Events List Section */}
      <section className="max-w-4xl mx-auto my-8 sm:my-12 space-y-6 sm:space-y-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#3ab9f1]">
          {t('currentEvents')}
        </h2>

        {/* Search Bar */}
        <div className="relative px-4 sm:px-6">
          <input
            type="text"
            placeholder={t('searchEvent')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-3 sm:py-4 rounded-lg bg-[#1e1e24] text-sm sm:text-base text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#3ab9f1] focus:border-transparent"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute right-6 top-1/2 transform -translate-y-1/2 h-5 w-5 sm:h-6 sm:w-6 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="relative bg-[#23272e] rounded-lg p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow overflow-hidden group min-w-[250px] sm:min-w-[300px] mx-auto flex flex-col h-[300px] sm:h-[350px]"
            >
              <div className="absolute top-0 left-0 w-full h-1/4 bg-[#3ab9f1] opacity-40 group-hover:opacity-60 transition-opacity"></div>
              <div className="relative z-10 space-y-3 sm:space-y-4 flex flex-col justify-between h-full">
                {/* Event Name */}
                <div className="flex justify-between items-center text-white">
                  <h3 className="text-lg sm:text-xl font-semibold text-ellipsis overflow-hidden">
                    {event.name}
                  </h3>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 sm:h-8 sm:w-8 text-[#3ab9f1]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                {/* Barcode and Access Code */}
                <div className="space-y-2 sm:space-y-3 text-gray-300">
                  <div className="flex justify-center items-center space-x-2">
                    <span className="text-sm sm:text-base">{event.barcode}</span>
                    <span className="font-medium text-sm sm:text-base"> :{t('barcode')}</span>
                  </div>
                  <div className="flex justify-center items-center space-x-2">
                    <span className="text-sm sm:text-base">{event.access_code}</span>
                    <span className="font-medium text-sm sm:text-base">:{t('accessCode')}</span>
                  </div>
                </div>
                {/* Buttons */}
                <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 mt-4 sm:mt-6">
                  <Link to={`/admin-album/${event.id}`} className="w-full">
                    <button className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-[#3ab9f1] to-[#2a9fd6] text-white rounded-lg shadow-md hover:shadow-lg transition-shadow text-sm sm:text-lg">
                      {t('viewAlbum')}
                    </button>
                  </Link>
                  <button
                    onClick={() => generateBarcodeAndDownload(event.barcode, event.name)}
                    className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-[#3ab9f1] to-[#2a9fd6] text-white rounded-lg shadow-md hover:shadow-lg transition-shadow text-sm sm:text-lg"
                  >
                    {t('downloadBarcode')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Admin;