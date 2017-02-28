import PowerSocket from './util/power-socket'



const websocket_uri = localStorage.getItem('websocket_uri') || 'ws://devgs.bustabit.com/ws';

const socket = new PowerSocket(websocket_uri);


socket.on('error', err => {
  console.error('Caught an error from the socket: ', err);
});




window._socket = socket; // for ease of repl debugging



export default socket;
