import React, { useState, useEffect, useRef } from "react";
import { auth, firestore } from "../FireBase";
import { Avatar, HStack, Stack, Box } from "@chakra-ui/react";
import { collection, orderBy, onSnapshot, query } from "firebase/firestore";
import Header from "../components/Header";
import { v4 as uuidv4 } from "uuid";
import SendMsg from "../components/SendMsg";
import { useTitle } from "react-haiku";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState({});
  const scroll = useRef();
  useTitle("Chat App | Chats");

  useEffect(() => {
    const q = query(
      collection(firestore, "messages"),
      orderBy("createdAt", "asc")
    );
    const unsubscribe1 = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => doc.data()));
    });

    const userRef = collection(firestore, "users");
    const unsubscribe2 = onSnapshot(userRef, (snapshot) => {
      const usersObject = {};
      snapshot.docs.forEach((doc) => {
        usersObject[doc.id] = doc.data();
      });
      setUsers(usersObject);
    });

    return () => {
      unsubscribe1();
      unsubscribe2();
    };
  }, []);

  useEffect(() => {
    scroll.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <>
      <Header />
      <Stack my="75px">
        {messages.map(({ text, uid, name }) => (
          <Box key={uuidv4()}>
            <div
              className={`msg ${
                uid === auth.currentUser.uid ? "sent" : "received"
              }`}
            >
              <div className="name">
                {uid === auth.currentUser.uid ? "" : "~" + name}
              </div>
              <HStack spacing={2} alignItems="center">
                <Avatar size="sm" src={users[uid]?.photoURL} />
                <p>{text}</p>
              </HStack>
            </div>
          </Box>
        ))}
      </Stack>
      <SendMsg />
      <div ref={scroll}></div>
    </>
  );
};

export default Chat;
