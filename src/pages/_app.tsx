import React, { useState, useEffect } from 'react';
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";
import theme from "@/theme";
import createEmotionCache from "@/lib/createEmotionCache";
import { AuthProvider } from "@/common/context/AuthContext";
import BaseLayout from "@/components/BaseLayout";
import Loader from "@/components/Loader";
import { LoaderProvider } from "@/components/Loader/LoaderContext";
import 'react-toastify/dist/ReactToastify.css';
import { ConfigProvider } from 'antd';
import '@/config/antd';


const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ConfigProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LoaderProvider>
          <BaseLayout>
            <AuthProvider>
              <Component {...pageProps} />
            </AuthProvider>
          </BaseLayout>
          <Loader />
        </LoaderProvider>
      </ThemeProvider>
    </ConfigProvider>
  );
}
