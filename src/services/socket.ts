import { io } from 'socket.io-client';

export const socket = io('https://ashfriendly.letsgetwebdesign.com:5153');
socket.on('connect', () => {
  console.log('Connected to socket server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from socket server');
});

