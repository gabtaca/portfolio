// src/components/Layout.js

import LightningHeader from './LightningHeader';

export default function Layout({ children }) {
  return (
    <div className="div_body flex flex-col justify-between min-h-screen">
      {/* Header permanent */}
      <LightningHeader />

      {/* Contenu spécifique à chaque page */}
      <main className="display-flex flex-col gap-8 justify-between items-center">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white h-[15vh] z-50 justify-center relative">

      </footer>
    </div>
  );
}
