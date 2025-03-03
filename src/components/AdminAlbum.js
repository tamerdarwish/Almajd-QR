import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useTranslation } from 'react-i18next'; // إضافة useTranslation

const AdminAlbum = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [eventFiles, setEventFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null); // حالة لعرض النافذة المنبثقة
  const { eventId } = useParams(); // استخراج eventId مباشرةً من الرابط
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(); // استخدام useTranslation

  // دالة لتغيير اللغة
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  // التحقق من الجلسة
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

  // جلب الملفات بناءً على eventId
  useEffect(() => {
    const fetchEventFiles = async () => {
      try {
        const { data: files, error } = await supabase
          .from('files')
          .select('*')
          .eq('event_id', eventId);

        if (error) {
          console.error('خطأ أثناء جلب الملفات:', error.message);
          return;
        }

        setEventFiles(files);
      } catch (error) {
        console.error('حدث خطأ أثناء جلب البيانات:', error.message);
      }
    };

    if (session) {
      fetchEventFiles();
    }
  }, [eventId, session]);

  const handleDelete = async (fileUrl, fileId) => {
    try {
      const filePath = fileUrl.split('/').slice(-2).join('/');
      if (!filePath) {
        alert(t('invalidFileLink'));
        return;
      }

      // حذف الملف من التخزين
      const { error: storageError } = await supabase.storage
        .from('wedding-album')
        .remove([filePath]);

      if (storageError) {
        console.error('خطأ أثناء حذف الملف من الـ Bucket:', storageError.message);
        alert(`${t('deleteBucketError')}: ${storageError.message}`);
        return;
      }

      // حذف بيانات الملف من قاعدة البيانات
      const { error: dbError } = await supabase
        .from('files')
        .delete()
        .eq('id', fileId);

      if (dbError) {
        console.error('خطأ أثناء حذف بيانات الملف:', dbError.message);
        alert(`${t('deleteDBError')}: ${dbError.message}`);
        return;
      }

      setEventFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
      alert(t('fileDeletedSuccess'));
    } catch (error) {
      console.error('حدث خطأ أثناء حذف الملف:', error.message);
      alert(`${t('deleteError')}: ${error.message}`);
    }
  };

  if (loading) {
    return <p>{t('loading')}</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#141517] via-[#1e2024] to-[#3c4043] font-tajawal text-white">
      {/* Header Section */}
      <header className="flex justify-between items-center bg-transparent backdrop-blur-md text-white p-4 sm:p-6 shadow-xl">
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

        {/* Logo and Title */}
        <div className="flex items-center gap-2 sm:gap-4">
          <img src="/logo.png" alt="Logo" className="w-8 h-8 sm:w-12 sm:h-12 rounded-full shadow-lg" />
          <h1 className="text-lg sm:text-2xl font-bold">{t('album')}</h1>
        </div>
      </header>

      {/* Event Album Section */}
      <section className="max-w-5xl mx-auto my-8 sm:my-16 p-6 sm:p-8 bg-[#2b2f38] rounded-lg shadow-lg backdrop-blur-md">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#3ab9f1] mb-6 sm:mb-8">
          {t('eventAlbum')}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {eventFiles.map((file) => (
            <div
              key={file.id}
              className="relative bg-[#23272e] rounded-lg p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow overflow-hidden group min-w-[250px] sm:min-w-[300px] mx-auto flex flex-col h-[300px] sm:h-[350px]"
            >
              <div className="absolute top-0 left-0 w-full h-1/4 bg-[#3ab9f1] opacity-40 group-hover:opacity-60 transition-opacity"></div>
              <div className="relative z-10 space-y-3 sm:space-y-4 flex flex-col justify-between h-full">
                {/* File Preview */}
                <div
                  className="flex justify-center items-center cursor-pointer"
                  onClick={() => setSelectedFile(file.file_url)} // فتح الملف عند النقر
                >
                  {file.file_type === 'image' ? (
                    <img
                      src={file.file_url}
                      alt={file.file_name}
                      className="max-w-[200px] max-h-[200px] object-cover rounded-lg"
                    />
                  ) : (
                    <video controls className="max-w-[200px] max-h-[200px] object-cover rounded-lg">
                      <source src={file.file_url} type="video/mp4" />
                      {t('unsupportedVideo')}
                    </video>
                  )}
                </div>
                {/* Delete Button */}
                <div className="flex justify-center mt-4">
                  <button
                    onClick={() => handleDelete(file.file_url, file.id)}
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-[#ff4d4d] to-[#d83b3b] text-white rounded-lg shadow-md hover:shadow-lg transition-shadow text-sm sm:text-lg"
                  >
                    {t('delete')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal for Viewing Files */}
      {selectedFile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setSelectedFile(null)} // إغلاق النافذة عند النقر خارجها
        >
          <div
            className="bg-[#2b2f38] p-6 rounded-lg shadow-lg max-w-3xl w-full relative"
            onClick={(e) => e.stopPropagation()} // منع إغلاق النافذة عند النقر داخلها
          >
            <button
              className="absolute top-2 right-2 text-white text-xl hover:text-red-500 transition-colors"
              onClick={() => setSelectedFile(null)} // إغلاق النافذة باستخدام الزر
            >
              &times;
            </button>
            {selectedFile.endsWith('.mp4') || selectedFile.includes('video') ? (
              <video controls autoPlay className="w-full h-auto max-h-[80vh]">
                <source src={selectedFile} type="video/mp4" />
                {t('unsupportedVideo')}
              </video>
            ) : (
              <img
                src={selectedFile}
                alt="Preview"
                className="w-full h-auto max-h-[80vh] object-contain"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAlbum;