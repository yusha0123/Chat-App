import React, { useState } from 'react'
import { firestore, auth } from '../firebase'
import firebase from 'firebase/compat/app';
import { Input, Button } from '@mui/material'
import SendIcon from '@mui/icons-material/Send';

function SendMsg() {
    const [msg, setMsg] = useState('')

    async function sendMessage(e) {
        e.preventDefault()

        const uid = auth.currentUser.uid;
        const photoURL = auth.currentUser.photoURL;
        const name = auth.currentUser.displayName;

        await firestore.collection('messages').add({
            text: msg,
            photoURL,
            uid,
            name,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        setMsg('')
    }
    return (
        <div>
            <form onSubmit={sendMessage}>
                <div className="sendMsg">
                    <Input style={{ width: '75%', fontSize: '15px', fontWeight: '550', marginLeft: '1.2rem', marginBottom: '5px' }} placeholder='Message' type="text" value={msg} onChange={e => setMsg(e.target.value)}/>
                    <Button style={{ width: '20%', fontSize: '10px', fontWeight: '550', margin: '4px 5px 5px 15px', maxWidth: '175px',padding:'5px' }} type="submit" disabled={!msg} variant="contained" endIcon={<SendIcon />} color="warning"></Button>
                </div>
            </form>
        </div>
    )
}

export default SendMsg

