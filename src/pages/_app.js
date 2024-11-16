// src/pages/_app.js
import '../styles/styles.scss'; // Import global styles
import { useEffect } from 'react';
import Layout from '../components/Layout';


function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
  
    setVH();
    window.addEventListener("resize", setVH);
  
    return () => window.removeEventListener("resize", setVH);
  }, []);

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
