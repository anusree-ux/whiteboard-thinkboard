"use client";
import { useRouter } from "next/router";
import { nanoid } from "nanoid";
import Image from "next/image";
import team from "../assets/team.svg";
import buttonStyles from "../constants/buttonStyles";
import JoinModal from "./JoinModal";
import { useState } from "react";


export default function Hero({ onStart }) {
   const router = useRouter();

  const handleStart = () => {
    const roomId = nanoid(6); // generates unique room ID
    router.push(`/whiteboard/${roomId}`);
  };

  const [showModal, setShowModal] = useState(false);
  

  return (
    <section className="relative min-h-screen sm:px-16 px-6 flex flex-col pb-0" >
      <div className="flex-1 flex flex-col sm:flex-row items-center justify-between mt-6 sm:mt-0 ">
        
        
        {/* Left Content */}
        <div className="flex-1 flex flex-col items-start">
          <h1 className="mt-20 sm:mt-0 max-w-xl text-5xl font-bold font-poppins text-transparent bg-gradient-to-r from-[#694F8E] to-[#E3A5C7] bg-clip-text leading-tight  ">
            Create. Collaborate. Present.
          </h1>

          <p className="font-poppins font-semibold  text-[rgba(105,79,142,0.74)] text-[18px] max-w-[550px] mt-5 dark:text-gray-300">
            Work together in real time on a shared whiteboard — sketch ideas, plan projects, and brainstorm visually, no matter where your team is.
          </p>

          <div className="flex sm:flex-row gap-6 mt-5">
            <button onClick={() => setShowModal(true)} className={buttonStyles.outline}>Join using ID</button>
            <button className={buttonStyles.primary} onClick={handleStart}>Try Whiteboard</button>
          </div>
        </div>

        {/* Right Illustration */}
        <div className="flex-1 flex justify-center">
          <Image
            src={team} 
            className="object-contain"
            width={600}    
            height={500}
          />
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-gray-400 font-poppins text-sm mt-auto bottom-0 pb-2">
        Made for creators, by creators. | 100% free | No signup needed
      </p>

      {/* Join Modal */}
      <JoinModal show={showModal} onClose={() => setShowModal(false)} />
    </section>
  );
}
