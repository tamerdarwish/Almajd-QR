import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const AdminAlbum = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [eventFiles, setEventFiles] = useState([]);
  const { eventId } = useParams(); // استخراج eventId مباشرةً من الرابط
  const navigate = useNavigate();

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
        alert('رابط الملف غير صالح!');
        return;
      }

      // حذف الملف من التخزين
      const { error: storageError } = await supabase.storage
        .from('wedding-album')
        .remove([filePath]);

      if (storageError) {
        console.error('خطأ أثناء حذف الملف من الـ Bucket:', storageError.message);
        alert(`خطأ أثناء حذف الملف من الـ Bucket: ${storageError.message}`);
        return;
      }

      // حذف بيانات الملف من قاعدة البيانات
      const { error: dbError } = await supabase
        .from('files')
        .delete()
        .eq('id', fileId);

      if (dbError) {
        console.error('خطأ أثناء حذف بيانات الملف:', dbError.message);
        alert(`خطأ أثناء حذف بيانات الملف: ${dbError.message}`);
        return;
      }

      setEventFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
      alert('تم حذف الملف بنجاح!');
    } catch (error) {
      console.error('حدث خطأ أثناء حذف الملف:', error.message);
      alert(`حدث خطأ أثناء حذف الملف: ${error.message}`);
    }
  };

  if (loading) {
    return <p>جارٍ التحميل...</p>;
  }
  return (
    <div className="min-h-screen bg-gradient-to-r from-[#141517] via-[#1e2024] to-[#3c4043] font-tajawal text-white">
      {/* Header Section */}
      <header className="flex justify-between items-center bg-transparent backdrop-blur-md text-white p-4 sm:p-6 shadow-xl">
        <div className="flex items-center gap-2 sm:gap-4">
          <img src="/logo.png" alt="Logo" className="w-8 h-8 sm:w-12 sm:h-12 rounded-full shadow-lg" />
          <h1 className="text-lg sm:text-2xl font-bold">ألبوم المناسبة</h1>
        </div>
      </header>
  
      {/* Event Album Section */}
      <section className="max-w-5xl mx-auto my-8 sm:my-16 p-6 sm:p-8 bg-[#2b2f38] rounded-lg shadow-lg backdrop-blur-md">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#3ab9f1] mb-6 sm:mb-8">ألبوم المناسبة</h2>
  
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {eventFiles.map((file) => (
            <div
              key={file.id}
              className="relative bg-[#23272e] rounded-lg p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow overflow-hidden group min-w-[250px] sm:min-w-[300px] mx-auto flex flex-col h-[300px] sm:h-[350px]"
            >
              <div className="absolute top-0 left-0 w-full h-1/4 bg-[#3ab9f1] opacity-40 group-hover:opacity-60 transition-opacity"></div>
              <div className="relative z-10 space-y-3 sm:space-y-4 flex flex-col justify-between h-full">
                {/* File Preview */}
                <div className="flex justify-center items-center">
                  {file.file_type === 'image' ? (
                    <img
                      src={file.file_url}
                      alt={file.file_name}
                      className="max-w-[200px] max-h-[200px] object-cover rounded-lg"
                    />
                  ) : (
                    <video controls className="max-w-[200px] max-h-[200px] object-cover rounded-lg">
                      <source src={file.file_url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
                {/* File Name */}
                <p className="text-center text-sm sm:text-base text-gray-300">{file.file_name}</p>
                {/* Delete Button */}
                <div className="flex justify-center mt-4">
                  <button
                    onClick={() => handleDelete(file.file_url, file.id)}
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-[#ff4d4d] to-[#d83b3b] text-white rounded-lg shadow-md hover:shadow-lg transition-shadow text-sm sm:text-lg"
                  >
                    حذف
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

export default AdminAlbum;
