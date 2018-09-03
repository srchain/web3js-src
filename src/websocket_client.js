"use strict"

const io = require('socket.io-client');
const server_ip = 'http://192.168.10.224:60000';

const Socket = io( server_ip, {
  autoConnect:false
});

Socket.on('connect', ()=>{
		if( Socket.connected ){
			console.log( 'socket.id : ' + Socket.id + ', connect websocket success!');
		}else{
			console.log( 'connect error' );
		}
});

// 当服务器断线时,自动重连
Socket.on('disconnect', (reason)=>{
	if (reason === 'io server disconnect') {
     // the disconnection was initiated by the server, you need to reconnect manually
     Socket.connect();
   }
});

Socket.on('msg', ()=>{
  console.log('msg', 'data', typeof data)
});


module.exports = Socket;
