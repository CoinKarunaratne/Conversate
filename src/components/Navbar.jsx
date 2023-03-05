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
import { signOut } from "firebase/auth";
import { setLogout } from "../state";

export default function Navbar() {
  const user = useSelector((state) => state.user);
  const toast = useToast();
  const createToast = () => {
    toast({
      title: "Logged Out",
      description: "Succesfully logged out",
      duration: 5000,
      isClosable: true,
      status: "success",
      position: "top",
      icon: <UnlockIcon />,
    });
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <Flex as="nav" p="10px" alignItems="center">
      <Heading as="h1">Conversate</Heading>
      <Spacer />
      <HStack spacing="20px">
        <Avatar src={user.photoURL}>
          <AvatarBadge width="1.3em" bg="teal.500">
            <Text fontSize="xs" color="white">
              7
            </Text>
          </AvatarBadge>
        </Avatar>
        <Text className="hidden sm:inline-block">{user.displayName}</Text>
        <Button
          colorScheme="green"
          onClick={() => {
            createToast();
            signOut(auth);
            dispatch(setLogout());
            navigate("/");
          }}
        >
          Sign Out
        </Button>
      </HStack>
    </Flex>
  );
}
