"use client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CanvasBoard from "../../components/CanvasBoard";
import { initSocket } from "@/lib/socket";

export default function WhiteboardRoom() {
  const router = useRouter();
  const { id } = router.query;

  const [roomId, setRoomId] = useState(null);

  useEffect(() => {
    if (!id) return;
  
    setRoomId(id);
  
    const socket = initSocket();
  
    socket.emit("join-room", { roomId: id });
  
    const handleUserJoined = ({ socketId }) => {
      console.log("A new user joined:", socketId);
    };
  
    socket.on("user-joined", handleUserJoined);
  
    return () => {
      socket.off("user-joined", handleUserJoined);
      socket.disconnect();
    };
  }, [id]);
  

  if (!roomId) return <div>Loading...</div>;

  return (
    <div> 
      <CanvasBoard roomId={roomId} />
    </div>
  );
}
