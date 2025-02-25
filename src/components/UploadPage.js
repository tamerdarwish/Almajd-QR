import React,{useState} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "../supabaseClient";
import { v4 as uuidv4 } from "uuid";
import QRCode from 'qrcode';  // إضافة مكتبة QRCode


const UploadPage = ({ events, files, setFiles }) => {
  const { t, i18n } = useTranslation();
  const { barcode } = useParams();
  const navigate = useNavigate();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // تغيير اللغة
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const event = events.find((e) => e.barcode === barcode);
  if (!event) {
    navigate("/not-found");
    return null;
  }

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setUploadedFiles(selectedFiles);
  };

  const handleUpload = async () => {
    try {
      if (uploadedFiles.length === 0) {
        alert(t("selectFiles"));
        return;
      }
      setLoading(true);

      // رفع كل ملف إلى Supabase Storage مع تحديث تقدم الرفع
      const uploadedFileRecords = await Promise.all(
        uploadedFiles.map(async (file, index) => {
          const uniqueFileName = `${uuidv4()}-${file.name}`;
          const filePath = `${event.id}/${uniqueFileName}`;
          const { data, error } = await supabase.storage
            .from("wedding-album")
            .upload(filePath, file, {
              onUploadProgress: (progress) => {
                setUploadProgress(((index + 1) / uploadedFiles.length) * 100);
              },
            });
            window.location.reload();


          if (error) throw error;
          return {
            event_id: event.id,
            file_name: file.name,
            file_type: file.type.includes("image") ? "image" : "video",
            file_url: `${process.env.REACT_APP_SUPABASE_STORAGE_URL}/storage/v1/object/public/wedding-album/${filePath}`,
          };
        })
      );

      // إضافة بيانات الملفات إلى جدول `files`
      const { data: insertData, error: insertError } = await supabase
        .from("files")
        .insert(uploadedFileRecords);
      if (insertError) throw insertError;

      setFiles((prevFiles) => [...prevFiles, ...uploadedFileRecords]);
      alert(t("uploadSuccess"));
    } catch (error) {
      console.error("حدث خطأ أثناء رفع الملفات:", error.message);
      alert(`${t("uploadError")}: ${error.message}`);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#141517] via-[#1e2024] to-[#3c4043] font-tajawal text-white">
      {/* Header Section */}
      <header className="flex justify-between items-center bg-transparent backdrop-blur-md text-white p-4 sm:p-6 shadow-xl">
        <div className="flex items-center gap-2 sm:gap-4">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-8 h-8 sm:w-12 sm:h-12 rounded-full shadow-lg"
          />
          <h1 className="text-2xl sm:text-4xl font-bold text-[#3ab9f1] text-shadow-lg">
            {t("sharePhotosVideos")}
          </h1>
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

      {/* Upload Section */}
      <section className="max-w-5xl mx-auto my-8 sm:my-16 p-6 sm:p-8 bg-[#2b2f38] rounded-lg shadow-lg backdrop-blur-md">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#3ab9f1] mb-6 sm:mb-8">
          {t("event", { name: event.name })}
        </h2>
        <h5 className="text-xl sm:text-2xl font-bold text-center text-[#3ab9f1] mb-6 sm:mb-8">
          {t("shareMoments")}
        </h5>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="block mx-auto mb-4 p-2 rounded-lg bg-[#23272e] text-white"
        />
        {loading && (
          <div className="flex justify-center mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#3ab9f1]"></div>
            <p className="text-white ml-2">{t("uploading")}</p>
          </div>
        )}
        {!loading && (
          <div className="flex justify-center mb-6">
            <button
              onClick={handleUpload}
              className="px-6 py-3 bg-gradient-to-r from-[#3ab9f1] to-[#0072f5] text-white rounded-lg shadow-md hover:shadow-lg"
            >
              {t("share")}
            </button>
          </div>
        )}
        {uploadProgress > 0 && !loading && (
          <div
            className="bg-[#1e2024] text-white p-4 rounded-lg mt-3"
          >
            {t("uploadProgress", { progress: uploadProgress })}
          </div>
        )}
        <div
          className="bg-[#1e2024] text-white p-4 rounded-lg mt-3"
        >
          {t("thankYou")}
        </div>
      </section>
    </div>
  );
};

export default UploadPage;