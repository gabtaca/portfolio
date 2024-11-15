// src/pages/_app.js
import '../styles/styles.scss'; // Import global styles
import { useEffect } from 'react';
import Layout from '../components/Layout';


function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Dynamically update viewport height for mobile responsiveness
    const resizeOps = () => {
      document.documentElement.style.setProperty("--vh", window.innerHeight * 0.01 + "px");
    };

    resizeOps(); // Set on mount
    window.addEventListener("resize", resizeOps); // Listen for window resize events

    return () => window.removeEventListener("resize", resizeOps); // Cleanup listener
  }, []);

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
