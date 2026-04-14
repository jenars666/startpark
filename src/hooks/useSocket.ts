'use client';

import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
    });

    socketRef.current.on('connect', () => {
      console.log('Socket connected');
    });

    socketRef.current.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return socketRef.current;
}

export function useProductUpdates(onUpdate: (event: string, data: any) => void) {
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on('product:created', (data) => onUpdate('created', data));
    socket.on('product:updated', (data) => onUpdate('updated', data));
    socket.on('product:deleted', (data) => onUpdate('deleted', data));

    return () => {
      socket.off('product:created');
      socket.off('product:updated');
      socket.off('product:deleted');
    };
  }, [socket, onUpdate]);
}
