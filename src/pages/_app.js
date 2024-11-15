// src/pages/_app.js

import { useEffect } from 'react';
import '../styles/styles.scss';
import 'animate.css';
import Layout from '../components/Layout';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const resizeOps = () => {
      document.documentElement.style.setProperty("--vh", window.innerHeight * 0.01 + "px");
    };

    // Run initially and on resize
    resizeOps();
    window.addEventListener("resize", resizeOps);

    // Cleanup on unmount
    return () => window.removeEventListener("resize", resizeOps);
  }, []);

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
