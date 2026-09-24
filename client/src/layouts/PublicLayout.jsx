import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { settingsService } from '../services/api';

const PublicLayout = () => {
  const [settings, setSettings] = useState({});

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await settingsService.getPublic();
        if (res.data.success) {
          setSettings(res.data.settings);
        }
      } catch (err) {
        console.warn('Could not load site settings, using defaults.', err);
      }
    };
    fetchSettings();
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar settings={settings} />
      <main className="flex-grow-1">
        <Outlet context={{ settings }} />
      </main>
      <Footer settings={settings} />
    </div>
  );
};

export default PublicLayout;
