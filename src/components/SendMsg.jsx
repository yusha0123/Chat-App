import { serverTimestamp, collection, addDoc } from "firebase/firestore";
import React, { useState } from "react";
import { firestore, auth } from "../firebase";
import { Input, InputGroup, IconButton } from "@chakra-ui/react";
import { FaPaperPlane } from "react-icons/fa";

const SendMsg = () => {
  const [msg, setMsg] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();

    const uid = auth.currentUser.uid;
    const name = auth.currentUser.displayName;
    await addDoc(collection(firestore, "messages"), {
      text: msg,
      uid,
      name,
      createdAt: serverTimestamp(),
    });
    setMsg("");
  };
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        width: "100%",
        zIndex: 3,
        padding: "10px",
        backgroundColor: "#fafafa",
        borderTop: "1px solid lightgray",
      }}
    >
      <form onSubmit={sendMessage}>
        <InputGroup>
          <Input
            type="text"
            autoComplete="off"
            placeholder="Type your message here"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
          />
          <IconButton
            type="submit"
            aria-label="Send"
            icon={<FaPaperPlane />}
            isDisabled={!msg}
          />
        </InputGroup>
      </form>
    </div>
  );
};

export default SendMsg;
