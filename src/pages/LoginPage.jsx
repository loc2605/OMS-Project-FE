import React from 'react';
import { Link } from 'react-router-dom';
import MarketingBanner from '../components/login/MarketingBanner';
import LoginForm from '../components/login/LoginForm';
import FooterLinks from '../components/common/FooterLinks';

const LoginPage = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark h-screen overflow-hidden">
      <div className="flex h-full flex-col lg:flex-row">
        <MarketingBanner />
        <div className="h-full flex flex-1 flex-col justify-center px-6 py-12 sm:px-12 lg:px-24 bg-white dark:bg-background-dark overflow-hidden">
          <div className="mx-auto w-full max-w-md h-full flex flex-col justify-between">
            <div>
              <LoginForm />
            </div>
            <FooterLinks />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;