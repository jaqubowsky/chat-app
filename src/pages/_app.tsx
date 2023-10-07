import { type AppType } from "next/app";

import { api } from "@/utils/api";

import { ThemeProvider } from "@/components/ThemeProvider";
import "@/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const MyApp: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  return (
    <ClerkProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <Component {...pageProps} />
      </ThemeProvider>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
