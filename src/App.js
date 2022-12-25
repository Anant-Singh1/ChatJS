import React, { useEffect, useRef, useState } from "react";

import {
  Box,
  Button,
  Container,
  HStack,
  Input,
  VStack,
} from "@chakra-ui/react";
// import { AiOutlineSend } from "react-icons/ai";
import Message from "./Component/Message";
import {
  onAuthStateChanged,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { app } from "./Component/Firebase";
// import { async } from "@firebase/util";
const auth = getAuth(app);
const db = getFirestore(app);
const loginHandler = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider);
};

const logoutHandler = () => {
  signOut(auth);
};

const App = () => {
  const [message, setMessage] = useState(false);
  const [messages, setMessages] = useState([]);
  const divForScroll = useRef(null);
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setMessage("");
      await addDoc(collection(db, "Messages"), {
        text: message,
        uid: user.uid,
        uri: user.photoURL,
        createdAt: serverTimestamp(),
      });

      divForScroll.current.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      alert("Error");
    }
  };

  const [user, setUser] = useState(false);
  useEffect(() => {
    const q = query(collection(db, "Messages"), orderBy("createdAt", "asc"));

    const unsub = onAuthStateChanged(auth, (data) => {
      setUser(data);
    });
    const unsubForMessage = onSnapshot(q, (snap) => {
      setMessages(
        snap.docs.map((item) => {
          const id = item.id;
          return { id, ...item.data() };
        })
      );
    });
    return () => {
      unsub();
      unsubForMessage();
    };
  }, []);

  return (
    <Box bg={"whatsapp.50"}>
      {user ? (
        <Container h={"100vh"} bg={"white"}>
          {/* VStack-->div with display:flex and flex-direction:column */}
          <VStack h={"full"} bg={""} paddingY={5}>
            <Button
              onClick={logoutHandler}
              colorScheme={"whatsapp"}
              w={"50%"}
              mb={3}
            >
              Sign Out
            </Button>
            <VStack h={"full"} w={"full"} overflowY="auto">
              {/* <Message text={"Sample Message for you"} uri={""} />
              <Message text={"Sample Message for none of you"} user={"me"} /> */}
              {messages.map((item) => (
                <Message
                  key={item.id}
                  text={item.text}
                  uri={item.uri}
                  user={item.uid === user.uid ? "me" : "other"}
                />
              ))}
              <div ref={divForScroll}></div>
            </VStack>

            <form style={{ width: "100%" }} onSubmit={submitHandler}>
              <HStack>
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message"
                  p={"5"}
                />
                <Button colorScheme={"gray"} type="submit">
                  Send
                </Button>
              </HStack>
            </form>
          </VStack>
        </Container>
      ) : (
        <VStack justifyContent={"center"} h={"100vh"}>
          <Button
            bg={"blue"}
            color={"white"}
            padding={8}
            fontSize={30}
            borderRadius={"full"}
            onClick={loginHandler}
          >
            Sign In with Google
          </Button>
        </VStack>
      )}
    </Box>
  );
};

export default App;
