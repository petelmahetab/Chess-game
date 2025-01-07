const express=require('express')
const socket=require('socket.io')
const http=require('http')
const {Chess}=require('chess.js')
const path=require('path')

const app=express()

const server=http.createServer(app)

const io=socket(server)


const chess=new Chess();
let players={}
let currentPlayer='w';

app.set('view engine','ejs')
app.use(express.static(path.join(__dirname,'public')))

app.get('/',(req,res)=>{
    res.render('index',{title:'Chess Game'})
})

io.on('connection',(uniqueSocket)=>{
 console.log("Connected to Back-End")

 
     //When any player visit brower then for playing this game allocates each of them roles.
     //Agar koi white color assign nhi hua toh firsṭ time osko Unique id ke saat me assign kardo..bolo ki W se khel raha hai...
     if(!players.white){
        players.white=uniqueSocket.id;
        uniqueSocket.emit('playerRole','w')
     }else if(!players.black){
        players.black=uniqueSocket.id;
        uniqueSocket.emit('playerRole','b')
     }else{
        uniqueSocket.emit('spectatorRole')
     }


     uniqueSocket.on('disconnect',()=>{

//If  any one player is removed then , we have to delete that object..
    if(uniqueSocket.id === players.white){
        delete players.white;
    }
    else if(uniqueSocket.id === players.black){
        delete players.black;
    }
    
})

//To handle event front end chess players for the validate the movements of chess players
   uniqueSocket.on('move',(m)=>{
    //For handling the Error we user Exeception handling
     try{
     //we check turn of players with colors and id with color of player not valid then Return
     if(chess.turn() === 'w' && uniqueSocket.id !== players.white) return ;
     if(chess.turn() === 'b' && uniqueSocket.id !== players.black) return ;
  
     //Proper moves for the players should take right...
      const result=chess.move(m);
      if(result)
      {
        currentPlayer=chess.turn();
        io.emit('move',m)
        io.emit('boardState',chess.fen())//fen() for sending all player's who are connected those are notified the 'currentState'
      }else{uniqueSocket.emit('Envalid Move',m)}
     }catch(err){
        console.error(err)
        uniqueSocket.emit('Envalid Move',m)
     }
   })

})

server.listen(3000,()=>{
    console.log("Server is ready..")
})


/*  ** Information **
 /We got the Data right from Front-End  to here Backend.
     //From here we want to send the data then 3 options are there 
     // A.Every-One [emit ()] method 
Receive karne ke liye Front end se pass kiye wale 'event' ka naam aur apna custom call back
and same event 'diconnect' hai joh disconnect karega connection
 //  uniqueSocket.on('chamaan',()=>{
    // })
  uniqueSocket.on('disconnect',()=>{
     console.log("Disconnected")
   })
*/