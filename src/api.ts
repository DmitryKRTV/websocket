import {io, Socket} from "socket.io-client";
import {messagesReceived, newMessageReceived} from "./chat-reducer";


export const api = {
    socket: null as null | Socket,
    createWSConnection() {
        this.socket = io("http://localhost:5000/");
    },
    destroyWSConnection() {
        this.socket?.disconnect()
        this.socket = null
    },
    subscribe(initMessagesHandler: (messages: any) => void,
              newMessagesHandler: (message: any) => void,
              userTypingHandler: (user: any) => void) {
        this.socket?.on('initMessages-published', initMessagesHandler)
        this.socket?.on('new-message-sent', newMessagesHandler)
        this.socket?.on('user-typing', userTypingHandler)
    },
    sendName(name: string) {
        this.socket?.emit("client-name-sent", name)
    },
    sendMessage(message: string) {
        this.socket?.emit("client-message-sent", message, (error: string | null) => {
            if(error) alert(error)
        })
    },
    typeMessage() {
        this.socket?.emit("client-typed")
    }

}


