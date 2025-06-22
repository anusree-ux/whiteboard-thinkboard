import { useRouter } from "next/router";
import { nanoid } from "nanoid";
import Hero from "../components/HeroSection";
import Navbar from "../components/Navbar";

export default function Home() {
  const router = useRouter();

  const handleStart = () => {
    const roomId = nanoid(6);
    router.push(`/whiteboard/${roomId}`);
  };

  return (
    <>
      <Navbar />
      <Hero onStart={handleStart} />
    </>
  );
}
