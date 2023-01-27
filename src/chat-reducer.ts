import {api} from "./api";

const initialState = {
    messages: [],
    usersTyping: [],
}

type InitialStateType = typeof initialState

export const chatReducer = (state: any = initialState, action: any) => {
    switch (action.type) {
        case "set-received": {
            return {...state, messages: action.messages}
        }
        case "new-message-received": {
            return {...state, messages: [...state.messages, action.message], usersTyping: [...state.usersTyping.filter((u: any) => u.id !== action.message.user.id)]}
        }
        case "typing-user-add": {
            return {...state, usersTyping: [...state.usersTyping.filter((u: any) => u.id !== action.user.id), action.user]}
        }
        default:
            return state

    }
}

export const messagesReceived = (messages: any) => ({type: "set-received", messages})
export const newMessageReceived = (message: any) => ({type: "new-message-received", message})
export const addTypingUser = (user: any) => ({type: "typing-user-add", user})



export const createConnection = () => (dispatch: any) => {
    api.createWSConnection()
    api.subscribe(
        (messages: any)=>{
            dispatch(messagesReceived(messages))
        },
        (message: any)=>{
            dispatch(newMessageReceived(message))
        },
        (user: any)=>{
            dispatch(addTypingUser(user))
        }
        )
}

export const destroyConnection = () => (dispatch: any) => {
    api.destroyWSConnection()
}

export const sendClientName = (name: string) => (dispatch: any) => {
    api.sendName(name)
}

export const sendClientMessage = (message: string) => (dispatch: any) => {
    api.sendMessage(message)
}

export const sendTypeMessage = () => (dispatch: any) => {
    api.typeMessage()
}


