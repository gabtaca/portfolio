// src/pages/_app.js

import '../styles/styles.scss';
import 'animate.css';
import Layout from '../components/Layout';


function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;