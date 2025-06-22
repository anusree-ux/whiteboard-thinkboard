import '@/styles/globals.css';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const body = document.body;

    // Reset body styles safely without affecting dark mode
    body.classList.remove(
      "bg-[url('/background.png')]",
      "bg-cover",
      "bg-center",
      "bg-no-repeat",
      "bg-fixed",
      "bg-white",
      "text-black",
      "dark:bg-gray-900",
      "dark:text-white"
    );

    if (router.pathname === '/') {
      // Landing page styling
      body.classList.add(
        "bg-[url('/background.png')]",
        "bg-cover",
        "bg-center",
        "bg-no-repeat",
        "bg-fixed",
        "transition-colors",
        "dark:bg-gray-900",
        "duration-500"
      );
    } else {
      // Other routes like /whiteboard/...
      body.classList.add("bg-white", "text-black");
    }
  }, [router.pathname]);

  return <Component {...pageProps} />;
}
