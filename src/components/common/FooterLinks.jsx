import React from 'react';

const FooterLinks = () => {
  return (
    <div className="mt-auto pt-10 border-t border-[#f5f2f0] dark:border-stone-800 flex flex-wrap justify-center gap-6 text-xs font-semibold text-[#8a7260] uppercase tracking-widest">
      <a className="hover:text-primary transition-colors" href="#">Help Center</a>
      <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
      <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
    </div>
  );
};

export default FooterLinks;