import React from 'react';
import firebase from 'firebase/compat/app';
import { auth } from '../firebase';
import GoogleButton from 'react-google-button';
import { Box, Center, Stack, Flex, Image } from '@chakra-ui/react';

function SignIn() {
    const signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider);
    }
    const logo = require('./chat.png')
    return (
        <Center h='100vh'>
            <Stack align='center'>
                <Box bg='gray.200' w='fit-content' color='orange.100' p={7} rounded='3xl' boxShadow='lg'>
                    <Flex flexDirection='column' alignItems='center'>
                        <Image boxSize='230px' src={logo} borderRadius='10' mb={5} />
                        <GoogleButton onClick={signInWithGoogle} />
                    </Flex>
                </Box>
            </Stack>
        </Center>

    )
}

export default SignIn