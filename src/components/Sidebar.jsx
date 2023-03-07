import {
  Flex,
  Text,
  HStack,
  Avatar,
  VStack,
  Heading,
  Divider,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { db } from "../config/firebase";
import {
  collection,
  documentId,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { setConversation, setNumber, setCurrentAvatar } from "../state";
import { motion } from "framer-motion";
import { isMobile } from "react-device-detect";

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const CurrentRoom = useSelector((state) => state.room);

  const [rooms, setRooms] = useState([]);
  const roomRef = collection(db, "rooms");
  const usersRef = collection(db, "users");
  const currentUser = useSelector((state) => state.user);

  const getChats = async () => {
    try {
      const rooms = await getDocs(roomRef);

      const filteredData = rooms.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      const filteredRoom = filteredData
        .filter((room) => room.users.includes(currentUser.uid))
        .filter((room) => room.messages && room.messages.length > 0);
      const filteredUsers = filteredRoom.map((room) => ({
        ...room,
        lastMessage: room.messages
          ? room.messages[room.messages.length - 1]
          : null,
        users: room.users.filter((user) => user !== currentUser.uid).join(", "),
      }));

      const getImage = async (users) => {
        const queryRef = query(usersRef, where("uid", "==", users));
        const querySnapshot = await getDocs(queryRef);
        const userDoc = querySnapshot.docs[0];
        const imageUrl = userDoc.data().photoURL;

        return imageUrl;
      };

      const getUserName = async (users) => {
        const queryRef = query(usersRef, where("uid", "==", users));
        const querySnapshot = await getDocs(queryRef);
        const userDoc = querySnapshot.docs[0];
        const displayName = userDoc.data().displayName;

        return displayName;
      };

      const sendersData = await Promise.all(
        filteredUsers.map(async (room) => ({
          ...room,
          photoUrl: await getImage(room.users),
          displayName: await getUserName(room.users),
        }))
      );
      setRooms(sendersData);
      await dispatch(setNumber({ conversations: sendersData.length }));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getChats();
  }, [CurrentRoom]);

  const setRoom = async (userID) => {
    try {
      const roomExistsQuery = query(roomRef, where(documentId(), "==", userID));
      const roomExistsSnapshot = await getDocs(roomExistsQuery);
      const filteredData = roomExistsSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      await dispatch(setConversation({ room: filteredData[0] }));
      isMobile ? navigate("/chat/mobile") : navigate("/home/chat");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-8 overflow-y-scroll max-h-full">
      <Flex className="text-lg text-slate-200">Latest Conversations</Flex>
      <Divider className="mb-10" />
      {rooms?.map((room, index) => (
        <motion.div
          whileTap={{ scale: 0.8 }}
          whileHover={{ scale: 0.95 }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className={`cursor-pointer rounded-lg ${
            room?.id === CurrentRoom?.id && "shadow-xl shadow-lime-500"
          }`}
          onClick={async () => {
            await dispatch(
              setCurrentAvatar({
                displayName: room.displayName,
                photoUrl: room.photoUrl,
              })
            );
            setRoom(room.id);
          }}
          key={index}
        >
          <Flex
            className={`mb-8 p-5 rounded-xl shadow-black shadow-md bg-red-100`}
          >
            <HStack className="gap-4">
              <Avatar src={room.photoUrl}></Avatar>
              <VStack>
                <h1 className="font-semibold self-start">
                  {room?.displayName}
                </h1>
                <p className=" self-start">
                  {room.lastMessage?.type === "image"
                    ? "Image"
                    : room.lastMessage?.text}
                </p>
              </VStack>
            </HStack>
          </Flex>
        </motion.div>
      ))}
    </div>
  );
}
