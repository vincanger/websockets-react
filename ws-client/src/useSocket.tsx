import { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';

// Usage: const { socket, isConnected } = useSocket('http://localhost:3000');
export function useSocket({endpoint, token } : { endpoint: string, token: string }) {
  const socket = socketIOClient(endpoint,  {
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
