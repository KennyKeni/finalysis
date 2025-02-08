import "@/styles/globals.css";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  return (
    <>
    {router.pathname === "/" || router.pathname === "/404" || router.pathname === "/settings" ? (
      <Component {...pageProps} />
    ) :
      <Layout>
        <Component {...pageProps} />
      </Layout>
    }
    </>
  );
}
