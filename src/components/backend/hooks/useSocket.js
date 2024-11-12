import { useEffect, useState } from "react";
import io from "socket.io-client";

export function useSocket(userId) {
  const [socket] = useState(() => io("http://localhost:4000"));

  useEffect(() => {
    socket.on(`notification-${userId}`, (notification) => {
      // handle notification logic here
    });

    return () => {
      socket.off(`notification-${userId}`);
      socket.disconnect();
    };
  }, [socket, userId]);

  return socket;
}
