import './App.css';
import SignIn from './components/SignIn';
import Chat from './components/Chat';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';
import { CircularProgress } from '@mui/material';
import { ChakraProvider } from '@chakra-ui/react';

function App() {
  const [user, loading] = useAuthState(auth);
  if (loading) {
    return (
      <div style={{ alignItems: "center", display: "flex", justifyContent: "center", height: "100vh", width: "100vw" }}>
        <CircularProgress color="inherit" />
      </div>
    )
  }
  if (user) {
    return (
      <Chat />
    )
  }
  return (
    <ChakraProvider>
      <SignIn />
    </ChakraProvider>
  )
}

export default App;
