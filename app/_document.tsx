import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Preload your critical CSS */}
          <link
            rel="preload"
            as="style"
            href="/_next/static/css/977354d18c3c8037.css"
          />
          <link
            rel="stylesheet"
            href="/_next/static/css/977354d18c3c8037.css"
          />

          {/* Optional: Fallback script if styles fail to load */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.addEventListener('DOMContentLoaded', () => {
                  try {
                    const hasCSS = Array.from(document.styleSheets).some(sheet => {
                      try {
                        return sheet.href && sheet.cssRules.length > 0;
                      } catch (e) {
                        return false;
                      }
                    });
                    if (!hasCSS) location.reload(); // retry once
                  } catch (e) {}
                });
              `,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
