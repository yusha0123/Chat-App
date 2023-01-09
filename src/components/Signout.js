import { Button } from '@mui/material'
import React from 'react'
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { auth } from '../firebase';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';

function Signout() {
    const photoURL = auth.currentUser.photoURL;
    const name = auth.currentUser.displayName;

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed">
                <Toolbar>
                <Avatar alt="userProfile" src={photoURL} variant="rounded" className='avatar'/>
                    <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
                        <p>{name}</p>
                    </Typography>
                    <Button onClick={() => auth.signOut()} endIcon={<ExitToAppIcon />} variant="contained" color="error">Sign Out</Button>
                </Toolbar>
            </AppBar>
        </Box>
    )
}

export default Signout