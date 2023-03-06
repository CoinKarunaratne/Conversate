import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import {
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
  query,
  orderBy,
  onSnapshot,
  collection,
  where,
  documentId,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { useState, useEffect, useRef } from "react";
import { Card, CardBody, Flex, Button, Spacer } from "@chakra-ui/react";
import { motion } from "framer-motion";

export default function Chat() {
  const room = useSelector((state) => state.room);
  const user = useSelector((state) => state.user);

  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");

  const dummyDivRef = useRef();

  const roomRef = doc(db, "rooms", room.id);
  const messageRef = collection(db, "rooms");

  useEffect(() => {
    const getMessages = async () => {
      try {
        const queryMessages = query(
          messageRef,
          where(documentId(), "==", room.id)
        );

        onSnapshot(queryMessages, (snapshot) => {
          let msg = [];
          snapshot.forEach((doc) => {
            let data = doc.data();
            let dataMsg = data.messages;
            msg.push(dataMsg);
          });
          setMessages(msg);
        });
      } catch (err) {
        console.log(err);
      }
    };

    getMessages();
  }, [room]);

  useEffect(() => {
    dummyDivRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newMsg === "") return;
    await updateDoc(roomRef, {
      messages: arrayUnion({
        type: "text",
        sender: user.displayName,
        senderID: user.uid,
        text: newMsg,
        createdAt: new Date(),
      }),
    });
    setNewMsg("");
  };

  return (
    <div className="flex flex-col relative h-full">
      <div className="overflow-y-scroll h-[80vh] p-[20px] lg:p-[40px]">
        {messages[0]?.map((msg, index) =>
          msg.type === "text" ? (
            <Flex
              key={index}
              className={`${
                msg.senderID === user.uid ? "justify-end" : "justify-start"
              }`}
            >
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Card
                  size={{ sm: "sm", lg: "md" }}
                  backgroundColor="orange.100"
                  className="w-[200px] lg:w-[300px] text-sm lg:text-base mb-5"
                >
                  <CardBody>{msg.text}</CardBody>
                </Card>
              </motion.div>
            </Flex>
          ) : (
            <div></div>
          )
        )}
        <div className="h-[70px]" ref={dummyDivRef}></div>
      </div>
      <div className="absolute bottom-0 w-full h-[80px] bg-gradient-to-r from-[#0172AF] to-[#74FEBD]">
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-row h-full gap-4 px-5"
        >
          <input
            type="text"
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            className="rounded-xl w-[85%] h-[80%] self-center px-5 outline-none"
          />
          <motion.button
            whileTap={{ scale: 0.8 }}
            whileHover={{ scale: 0.95 }}
            type="submit"
            className=" self-center h-[80%] w-[15%] border-white border-2 rounded-xl text-lg font-bold text-white"
          >
            Send
          </motion.button>
        </form>
      </div>
    </div>
  );
}
