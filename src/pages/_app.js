import "@/styles/globals.css";
import { UserProvider } from '@auth0/nextjs-auth0/client';
<<<<<<< HEAD

export default function App({ Component, pageProps }) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  )
=======

import Layout from "@/components/Layout";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  return (
    <UserProvider>
    {router.pathname === "/" || router.pathname === "/404" || router.pathname === "/settings" ? (
      <Component {...pageProps} />
      ) :
      <Layout>
        <Component {...pageProps} />
      </Layout>
    }
    </UserProvider>
  );
>>>>>>> main
}
