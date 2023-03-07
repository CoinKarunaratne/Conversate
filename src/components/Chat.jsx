import { useSelector } from "react-redux";
import {
  doc,
  updateDoc,
  arrayUnion,
  query,
  onSnapshot,
  collection,
  where,
  documentId,
} from "firebase/firestore";
import { db, storage } from "../config/firebase";
import { useState, useEffect, useRef } from "react";
import { Card, CardBody, Flex, Box, Image } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Icon } from "react-icons-kit";
import { image } from "react-icons-kit/fa/image";

export default function Chat() {
  const room = useSelector((state) => state.room);
  const user = useSelector((state) => state.user);

  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

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
    setUploadFile(null);
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

  const fileUpload = async () => {
    try {
      if (!uploadFile) return;
      setIsUploading(true);
      const fileRef = ref(storage, `Conversate/${uploadFile.name}`);
      await uploadBytes(fileRef, uploadFile);
      const downloadUrl = await getDownloadURL(fileRef);
      await updateDoc(roomRef, {
        messages: arrayUnion({
          type: "image",
          sender: user.displayName,
          senderID: user.uid,
          text: downloadUrl,
          createdAt: new Date(),
        }),
      });

      setUploadFile(null);
    } catch (err) {
      console.log(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col relative h-full">
      <div className="overflow-y-scroll h-[80vh] p-[20px] lg:p-[40px]">
        {messages[0]?.map((msg, index) =>
          msg.type === "image" ? (
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
                <Box boxSize="sm" className="flex mb-5">
                  <Image
                    src={msg.text}
                    alt="Chat-Image"
                    className="rounded-lg object-cover"
                  />
                </Box>
              </motion.div>
            </Flex>
          ) : (
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
          )
        )}
        <div className="h-[70px]" ref={dummyDivRef}></div>
      </div>
      <div className="absolute bottom-0 w-full h-[60px] bg-gradient-to-r from-[#0172AF] to-[#74FEBD]">
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
            className="self-center h-[80%] w-[10%] border-white border-2 rounded-xl text-base lg:text-lg font-bold text-white"
          >
            Sen
          </motion.button>
          <motion.label
            whileTap={{ scale: 0.8 }}
            whileHover={{ scale: 0.95 }}
            htmlFor="file"
            className="h-[80%] w-[10%] border-white text-slate-500 border-2 rounded-xl self-center flex justify-center"
          >
            <input
              id="file"
              onChange={(e) => {
                setUploadFile(e.target.files[0]);
              }}
              type="file"
              className="hidden"
            />
            <Icon size={"80%"} icon={image} className="text-center pt-2" />
          </motion.label>

          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            whileTap={{ scale: 0.8 }}
            whileHover={{ scale: 0.95 }}
            className={`h-[80%] w-[15%] rounded-xl self-center bg-sky-700 text-white font-semibold ${
              uploadFile == null && "hidden"
            }`}
            onClick={() => fileUpload()}
            disabled={isUploading}
          >
            Send Image
          </motion.button>
        </form>
      </div>
    </div>
  );
}
