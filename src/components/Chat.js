import React, { useState, useEffect, useRef } from 'react'
import { firestore, auth } from '../firebase'
import SendMsg from './SendMsg'
import Signout from './Signout'
import { Avatar } from '@mui/material'

function Chat() {
    const scroll = useRef(null)
    const [messages, setMessages] = useState([])
    useEffect(() => {
        firestore.collection('messages').orderBy('createdAt').limit(50).onSnapshot(snapshot => {
            setMessages(snapshot.docs.map(doc => doc.data()))
        })
    }, [])
    useEffect(() => {
        scroll.current.scrollIntoView({ behavior: 'smooth' })
    }, [messages])
    return (
        <div>
            <Signout />
            <div className="msgs">
                {messages.map(({ text, photoURL, uid, name }) => (
                    <div className='margin'>
                        <div key={messages.id} className={`msg ${uid === auth.currentUser.uid ? 'sent' : 'received'}`}>
                            <div className='name'>{uid === auth.currentUser.uid ? '' : "~" + name}</div>
                            <div className='flex'>
                                <Avatar src={photoURL} />
                                <p>{text}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div ref={scroll}></div>
            <SendMsg />
        </div>
    )
}

export default Chat