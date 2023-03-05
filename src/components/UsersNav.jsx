import { UnlockIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Spacer,
  HStack,
  useToast,
  Avatar,
  AvatarBadge,
} from "@chakra-ui/react";
import { auth } from "../config/firebase";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { db } from "../config/firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";

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
      }));
      const filteredRoom = filteredData.filter((room) =>
        room.users.includes(currentUser.uid)
      );

      if (filteredRoom.length >= 1) {
        console.log(filteredRoom[0].messages);
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
    <Flex as="nav" p="10px" alignItems="center" className="m-5">
      <HStack spacing="20px">
        {users.map((user) => {
          return (
            <Flex
              key={user.uid}
              className="flex flex-col w-[100px] gap-2 cursor-pointer self-baseline"
              onClick={() => {
                setRoom(user.uid);
              }}
            >
              <Avatar src={user.photoURL} alignSelf="center">
                <AvatarBadge width="1.3em" bg="teal.500">
                  <Text fontSize="xs" color="white">
                    7
                  </Text>
                </AvatarBadge>
              </Avatar>
              <Text textAlign="center">{user.displayName}</Text>
            </Flex>
          );
        })}
      </HStack>
    </Flex>
  );
}
