import React, { FC, useEffect } from "react";
import { AppProps } from "next/app";
import Head from "next/head";

import { RecoilRoot } from "recoil";

import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

import theme from "../src/theme";

const MyApp: FC<AppProps> = (props) => {
  const { Component, pageProps } = props;

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    jssStyles?.parentElement?.removeChild(jssStyles);
  }, []);

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width user-scalable=no"
        />

        <title>{process.env.title}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content={process.env.description} />
        <meta name="keywords" content={process.env.keywords} />

        {/* OGP */}
        <meta property="og:title" content={process.env.title} />
        <meta property="og:site_name" content={process.env.title} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={process.env.ogpUrl} />
        <meta property="og:image" content={process.env.ogpImage} />
        <meta property="og:description" content={process.env.description} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <RecoilRoot>
          <Component {...pageProps} />
        </RecoilRoot>
      </ThemeProvider>
    </>
  );
};

export default MyApp;
