import LightningHeader from "./LightningHeader";

export default function Layout({ children }) {
  return (
    <div className="body_layout h-100">
      {/* Header */}
      <header className="header_layout w-100">
        <LightningHeader />
      </header>
      
      {/* Main Content */}
      <main className="main_layout">
        {children}
      </main>

      {/* Footer */}
      <footer className="footer_layout"></footer>
    </div>
  );
}