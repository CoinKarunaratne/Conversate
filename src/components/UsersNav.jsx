import { Flex, Text, HStack, Avatar } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { db } from "../config/firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";
import { setConversation } from "../state";
import { isMobile } from "react-device-detect";

export default function UsersNav() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const userRef = collection(db, "users");
  const roomRef = collection(db, "rooms");
  const currentUser = useSelector((state) => state.user);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const users = await getDocs(userRef);
        const filteredData = users.docs.map((doc) => ({
          ...doc.data(),
        }));
        const filteredUsers = filteredData.filter(
          (user) => user.uid !== currentUser.uid
        );
        setUsers(filteredUsers);
      } catch (err) {
        console.log(err);
      }
    };
    getUsers();
  }, []);

  const setRoom = async (userID) => {
    try {
      const roomExistsQuery = query(
        roomRef,
        where("users", "array-contains", userID)
      );
      const roomExistsSnapshot = await getDocs(roomExistsQuery);
      const filteredData = roomExistsSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      const filteredRoom = filteredData.filter((room) =>
        room.users.includes(currentUser.uid)
      );

      if (filteredRoom.length >= 1) {
        await dispatch(setConversation({ room: filteredRoom[0] }));
        navigate("/home/chat");
      } else {
        await addDoc(roomRef, {
          users: [userID, currentUser.uid],
          messages: [],
        });
        setRoom(userID);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Flex
      as="nav"
      p="10px"
      alignItems="center"
      className="bg-gradient-to-r from-[#0172AF] to-[#74FEBD]"
    >
      <HStack spacing="20px" className="p-1 overflow-x-scroll">
        {users.map((user) => {
          return (
            <Flex
              key={user.uid}
              className="flex flex-col w-[100px] gap-2 cursor-pointer self-baseline"
              onClick={() => {
                setRoom(user.uid);
                isMobile && navigate("/chat/mobile");
              }}
            >
              <Avatar src={user.photoURL} alignSelf="center"></Avatar>
              <Text textAlign="center" color="white" className="font-semibold">
                {user.displayName}
              </Text>
            </Flex>
          );
        })}
      </HStack>
    </Flex>
  );
}
