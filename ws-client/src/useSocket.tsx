import { useState, useEffect } from 'react';
import socketIOClient, { Socket } from 'socket.io-client';

export type PollState = {
  question: string;
  options: {
    id: number;
    text: string;
    description: string;
    votes: string[];
  }[];
};
interface ServerToClientEvents {
  updateState: (state: PollState) => void;
}
interface ClientToServerEvents {
  vote: (optionId: number) => void;
  askForStateUpdate: () => void;
}

export function useSocket({endpoint, token } : { endpoint: string, token: string }) {
  const socket: Socket<ServerToClientEvents, ClientToServerEvents>  = socketIOClient(endpoint,  {
    auth: {
      token: token
    }
  }) 
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    console.log('useSocket useEffect', endpoint, socket)

    function onConnect() {
      setIsConnected(true)
    }

    function onDisconnect() {
      setIsConnected(false)
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
    }
  }, [token]);

  return {
    isConnected,
    socket,
  };
}
