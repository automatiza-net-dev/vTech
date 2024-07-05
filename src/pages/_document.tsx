import Document, { Html, Head, Main, NextScript } from "next/document";
import React from "react";

import { ServerStyleSheet } from "styled-components";

export default class MyDocument extends Document {
  static async getInitialProps(ctx: any) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App: any) => (props: any) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html lang="pt-BR">
        <Head>
        </Head>

        <body>
          <Main />
          <div id="NeoassistCentral"></div>
          <NextScript />

          <script defer type="text/javascript" dangerouslySetInnerHTML={{ __html: `
            (function() {
window.NeoAssistTag = {};
NeoAssistTag.querystring = true;
NeoAssistTag.pageid = '';
NeoAssistTag.clientdomain = 'sunguider.neoassist.com';
NeoAssistTag.initialize = { };
var na = document.createElement('script');
na.type = 'text/javascript';
na.async = true;
na.src = 'https://cdn.atendimen.to/n.js';
var s = document.getElementsByTagName('script')[0];
s.parentNode.insertBefore(na, s);
})();
          ` }}>

</script>
        </body>
      </Html>
    );
  }
}
