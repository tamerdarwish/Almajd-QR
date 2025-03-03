import React from 'react';
import { useTranslation } from 'react-i18next';
// استيراد أيقونات Fill من مكتبة react-icons
import {
  BsTelephoneFill, // أيقونة الهاتف (Fill)
  BsWhatsapp, // أيقونة WhatsApp (Fill)
  BsFacebook, // أيقونة Facebook (Fill)
  BsInstagram, // أيقونة Instagram (Fill)
  BsGeoAltFill, // أيقونة Waze (Fill)
} from 'react-icons/bs';
import { TbBrandWaze } from "react-icons/tb";

const Footer = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar' || i18n.language === 'he'; // التحقق من اللغة

  return (
    <footer
      className="bg-[#141517] text-white py-6 sm:py-8 mt-auto"
      dir={isRTL ? 'rtl' : 'ltr'} // تحديد اتجاه النص بناءً على اللغة
    >
      {/* Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
        {/* Left Section: Social Media Links */}
        <div className="flex flex-col items-center sm:items-start gap-4 mb-4 sm:mb-0">
          {/* "تواصل معنا" Title */}
          <h3 className="text-[#37beee] text-lg sm:text-xl font-semibold">
            {t('contactUs')}
          </h3>

          {/* Social Media Icons */}
          <div className="flex gap-6">
            {/* Phone Icon */}
            <a
              href="tel:+97246261155" // رقم الهاتف
              className="text-[#37beee] hover:text-[#3ab9f1] transition-colors"
              aria-label="Phone Number"
            >
              <BsTelephoneFill size={24} />
            </a>

            {/* WhatsApp Icon */}
            <a
              href="https://wa.me/+972522048572" // رابط WhatsApp
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#37beee] hover:text-[#3ab9f1] transition-colors"
              aria-label="WhatsApp"
            >
              <BsWhatsapp size={24} />
            </a>

            {/* Facebook Icon */}
            <a
              href="https://www.facebook.com/people/%D9%85%D8%B7%D8%A8%D8%B9%D9%87-%D8%A7%D9%84%D9%85%D8%AC%D8%AF/pfbid02CTC1f26yCJquQojHxDNAdJB8XmwskWNTFXax6BjLTtTqzp5QT57PSGmzWCa6xL9rl/?mibextid=wwXIfr&rdid=Ng577ryLzBSaxN13&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F18PsfZnGaR%2F%3Fmibextid%3DwwXIfr" // رابط Facebook مختصر
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#37beee] hover:text-[#3ab9f1] transition-colors"
              aria-label="Facebook"
            >
              <BsFacebook size={24} />
            </a>

            {/* Instagram Icon */}
            <a
              href="https://www.instagram.com/almajd.20/?igsh=MWxkcWRrenBoMWJwOQ%3D%3D#" // رابط Instagram مختصر
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#37beee] hover:text-[#3ab9f1] transition-colors"
              aria-label="Instagram"
            >
              <BsInstagram size={24} />
            </a>

            {/* Waze Icon */}
            <a
              href="https://ul.waze.com/ul?venue_id=22872389.228789430.516036&overview=yes&utm_campaign=default&utm_source=waze_website&utm_medium=lm_share_location" // رابط Waze مختصر
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#37beee] hover:text-[#3ab9f1] transition-colors"
              aria-label="Waze"
            >
              <TbBrandWaze size={30} />
            </a>
          </div>
        </div>

        {/* Center Section: Copyright */}
        <div className="text-center sm:text-left text-gray-400 text-sm sm:text-base">
          &copy; {new Date().getFullYear()} {t('footerCopyright')}
        </div>

        {/* Right Section: Developed By */}
        <div className="text-gray-400 text-sm sm:text-base">
          {t('developedBy')}{' '}
          <a
            href="https://tharwatdarwesh.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#3ab9f1] hover:underline transition-colors"
            aria-label="DarweshGroup Website"
          >
            DarweshGroup
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;