// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UploadPage from './components/UploadPage';
import Admin from './components/Admin';
import Album from './components/Album';
import AdminAlbum from './components/AdminAlbum';
import NotFound from './components/NotFound';
import LoginPage from './components/LoginPage';
import './App.css';
import { supabase } from './supabaseClient';
import { useTranslation } from "react-i18next";
import Footer from './components/Footer'; // استيراد الفوتر


function App() {
  const [events, setEvents] = useState([]);
  const [files, setFiles] = useState([]);
  const { i18n } = useTranslation();

  // جلب البيانات عند تشغيل التطبيق
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select('*');
        if (eventsError) throw eventsError;
        setEvents(eventsData);
        const { data: filesData, error: filesError } = await supabase
          .from('files')
          .select('*');
        if (filesError) throw filesError;
        setFiles(filesData);
      } catch (error) {
        console.error('حدث خطأ أثناء جلب البيانات:', error.message);
      }
    };
    fetchData();
  }, []);

  return (
    <div className={`app ${i18n.language === 'ar' ? 'lang-ar' : 'lang-he'}`}>
      <Router>
        <Routes>
        <Route path="/" element={<Album events={events} files={files} />} />
        <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<Admin events={events} />} />
          <Route
            path="/upload/:barcode"
            element={<UploadPage events={events} files={files} setFiles={setFiles} />}
          />
          <Route path="/album" element={<Album events={events} files={files} />} />
          <Route
            path="/admin-album/:eventId"
            element={<AdminAlbum files={files} setFiles={setFiles} />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Footer />

    </div>
  );
}

export default App;