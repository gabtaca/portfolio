// src/pages/_document.js

import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Autres balises meta ou liens si nécessaires */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}