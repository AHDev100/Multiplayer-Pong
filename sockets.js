let readyPlayerCount = 0; 

function listen(io){
    io.on('connection', (socket) => {
        let room; 

        console.log('a user connected', socket.id);

        socket.on('ready', () => {
          room = 'room' + Math.floor(readyPlayerCount/2); 
          socket.join(room); 
          console.log('Player ready', socket.id);
          readyPlayerCount++; 
          if(readyPlayerCount % 2 === 0){
            io.in(room).emit('startGame', socket.id); //Sets the second player ready as referee 
          }
        });
      
        socket.on('paddleMove', (paddleData) => {
          socket.to(room).emit('paddleMove', paddleData);
        });
      
        socket.on('ballMove', (ballData) => {
          socket.to(room).emit('ballMove', ballData);
        });
      
        socket.on('disconnect', (reason) => {
          console.log(`Client ${socket.id} disconnected: ${reason}`);
          socket.leave(room);
        }); 
    });
}; 

module.exports = {
    listen,
}