import React, {useEffect, useRef, useState} from 'react';
import './App.css';
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, AppStateType} from "./store";
import {createConnection, destroyConnection, sendClientMessage, sendClientName, sendTypeMessage} from "./chat-reducer";




function App() {

    const messages = useSelector((state: AppStateType) => state.chat.messages)
    const usersTyping = useSelector((state: AppStateType) => state.chat.usersTyping)
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(createConnection())
        return ()=> {
            dispatch(destroyConnection())
        }
    }, [])

    const [value, setValue] = useState<string>("")
    const [valueName, setValueName] = useState<string>("")
    const [autoScrollMod, setAutoScrollMod] = useState<boolean>(true)
    const [lastScrollTop, setLastScrollTop] = useState(0)

    // const [messages, setMessages] = useState<Array<any>>([])

    const messagesAnchor = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (autoScrollMod) {
            messagesAnchor.current?.scrollIntoView({behavior: "smooth"})
        }
    }, [messages])

    return (
        <div className="App">
            <div>
                <div style={{
                    border: "1px solid black",
                    padding: "10px",
                    width: "300px",
                    height: "300px",
                    margin: "0 auto",
                    overflowY: "scroll"
                }}
                     onScroll={event => {
                         let maxScrollPosition = event.currentTarget.scrollHeight - event.currentTarget.clientHeight


                         if (event.currentTarget.scrollTop > lastScrollTop && Math.abs(maxScrollPosition - event.currentTarget.scrollTop) < 5) {
                             setAutoScrollMod(true)
                         } else {
                             setAutoScrollMod(false)
                         }
                         setLastScrollTop(event.currentTarget.scrollTop)
                     }
                     }
                >
                    {messages && messages.map((m: any, i: any) => {
                        return <div key={i}>
                            <b>{m.user.name}: </b>{m.message}
                            <hr/>
                        </div>
                    })}
                    {usersTyping && usersTyping.map((m: any, i: any) => {
                        return <div key={i}>
                            <b>{m.name}</b>...
                            <hr/>
                        </div>
                    })}
                    <div ref={messagesAnchor}></div>
                </div>
                <div><input type="text" value={valueName} onChange={event => setValueName(event.currentTarget.value)}/>
                    <button onClick={event => {
                        dispatch(sendClientName(valueName))
                    }}>send name
                    </button>
                </div>

                <div style={{paddingTop: "10px",}}>
                    <textarea onKeyPress={event => {
                    dispatch(sendTypeMessage())}
                    } value={value} onChange={event => setValue(event.currentTarget.value)}/>
                </div>
                <button onClick={event => {
                    dispatch(sendClientMessage(value))
                    setValue("")
                }}>Send
                </button>
            </div>
        </div>
    );
}

export default App;
