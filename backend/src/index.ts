// ws library se WebSocketServer aur WebSocket import kar rahe hain connection handle karne ke liye
import { WebSocketServer, WebSocket } from 'ws';

// Port 8080 par ek naya WebSocket server shuru kar rahe hain
const wss = new WebSocketServer({ port: 8080 });

// Ek 'User' interface banaya hai taaki pata rahe ki har user ke paas uska socket aur room ID hogi
interface User {
    socket: WebSocket;
    room: string;
}

// Saare connected users ko store karne ke liye ek array banaya hai
let allSockets: User[] = [];

// Jab bhi koi naya client server se connect hota hai, ye "connection" event trigger hota hai
wss.on("connection", (socket) => {

    // Jab client server ko koi message bhejta hai, ye function chalta hai
    socket.on("message", (message) => {
        
        // Message buffer format mein hota hai, usse string mein badal kar JSON object bana rahe hain
        const parsedMessage = JSON.parse(message.toString());

        // Agar message ka type "join" hai, toh user ko kisi specific room mein dalna hai
        if (parsedMessage.type === "join") {
            // User ka socket aur uska room ID 'allSockets' array mein save kar rahe hain
            allSockets.push({
                socket,
                room: parsedMessage.payload.roomId
            });
            console.log("User room mein join ho gaya: " + parsedMessage.payload.roomId);
        }

        // Agar message ka type "chat" hai, toh message ko room ke baaki logo tak pahunchana hai
        if (parsedMessage.type === "chat") {
            // Pehle check kar rahe hain ki message bhejne wala user kaunse room mein hai
            const currentUser = allSockets.find(u => u.socket === socket);
            
            // Agar user mil jata hai, toh aage badhte hain
            if (currentUser) {
                // Poore array mein loop chala kar check kar rahe hain
                allSockets.forEach(user => {
                    // Agar kisi doosre user ka room wahi hai jo sender ka hai...
                    if (user.room === currentUser.room) {
                        // ...toh usse wo message bhej do
                        user.socket.send(parsedMessage.payload.message);
                    }
                });
            }
        }
    });

    // Jab koi user tab band kar deta hai ya disconnect hota hai
    socket.on("close", () => {
        // Disconnected user ko 'allSockets' array se nikaal rahe hain taaki memory waste na ho
        allSockets = allSockets.filter(user => user.socket !== socket);
        console.log("User chala gaya, list saaf kar di gayi.");
    });
});



// Humko na yeh message ko bhejna after the connection between the postman and hoppstoch , is message se dono ka same room create ho jsayega 
// {
//     "type": "join",
//     "payload": {
//         "roomId": "red-room"
//     }
// }

// chat between them be like in that format only
// from hoppstoch side 
// {
//   "type": "chat",
//   "payload": { "message": "Hey Postman, kya haal hai?" }
// }



// from the postman side 
// {
//   "type": "chat",
//   "payload": { 
//     "message": "Sab badhiya bhai! Hoppscotch par message mil gaya." 
//   }
//}




//wss.on("connection", (socket) => {
    //allSockets.push(socket);
    //userCount = userCount + 1;
    //console.log("user connected # " + userCount);


    // socket.on("message", (message)=>{
    //     console.log("Message received " + message.toString());
    //     for(let i = 0; i<allSockets.length; i++){
    //         const s = allSockets[i];
    //         s?.send(message.toString() +": sentt from the server side")
    //     }   
    // })



    // socket.on("disconnet", ()=>{
    //    allSockets = allSockets.filter(x => x != socket);
    // })
//})