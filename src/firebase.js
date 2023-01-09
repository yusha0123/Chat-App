import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

firebase.initializeApp({
   //your config here
  })
  
  const auth = firebase.auth();
  const firestore = firebase.firestore();

  export {auth,firestore}