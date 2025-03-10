import "@/styles/globals.css";
// import type { AppProps } from "next/app";
// import { SessionProvider } from "next-auth/react";

// export default function App({
//   Component,
//   pageProps: { session, ...pageProps },
// }: AppProps) {
//   return (
//     <SessionProvider session={session}>
//       <Component {...pageProps} />
//     </SessionProvider>
//   );
// }

import { Provider } from "react-redux";

import ToastContainer from "@/components/Toast/ToastContainer";
import ToastContextProvider from "@/components/Toast/ToastContextProvider";
import { SessionProvider } from "next-auth/react";
import Layout from "@layout/Layout";

export default function App({
  Component,
  pageProps,
}: {
  Component: any;
  pageProps: any;
}) {
  return (
    <SessionProvider session={pageProps.session}>
      <ToastContextProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
        <ToastContainer />
      </ToastContextProvider>
    </SessionProvider>
  );
}
