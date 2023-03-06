import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Button,
  Heading,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Avatar,
  VStack,
  Divider,
  Text,
  HStack,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useBreakpointValue,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { AiFillCamera, AiOutlineLogout } from "react-icons/ai";
import { auth, firestore, storage } from "../FireBase";
import { onSnapshot, collection } from "firebase/firestore";
import { Link } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const modalSize = useBreakpointValue({ base: "xs", md: "md", xl: "xl" });
  const toast = useToast();

  const changeAvatar = async (e) => {
    if (!e.target.files[0]) {
      return;
    }
    setLoading(true);
    const storageRef = ref(storage, "avatars/" + auth.currentUser.uid);
    try {
      await uploadBytes(storageRef, e.target.files[0]);
      const avatarURL = await getDownloadURL(storageRef);

      await updateProfile(auth.currentUser, {
        photoURL: avatarURL,
      });

      await updateDoc(doc(firestore, "users", auth.currentUser.uid), {
        name: auth.currentUser.displayName,
        photoURL: avatarURL,
        email: auth.currentUser.email,
      });
      setLoading(false);
      toast({
        position: "top",
        title: "Avatar Updated Successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast({
        position: "top",
        title: "Failed to Update Avatar!",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    const userRef = collection(firestore, "users");
    const unsubscribe = onSnapshot(userRef, (snapshot) => {
      let users = [];
      snapshot.docs.forEach((doc) => {
        users.push({ ...doc.data(), id: doc.id });
      });
      setUsers(users);
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <Box
        bg={"gray.300"}
        px={4}
        position="fixed"
        top={0}
        w="100%"
        boxShadow="md"
        zIndex={1}
      >
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <Heading size="xl">
            <Link to="/">WhatsChat</Link>
          </Heading>
          <Button onClick={() => setOpen(!open)}>
            <HamburgerIcon />
          </Button>
        </Flex>
      </Box>
      <Drawer isOpen={open} placement="right" onClose={() => setOpen(false)}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader textAlign="center">Menu</DrawerHeader>
          <DrawerBody>
            <VStack spacing={3}>
              <Avatar src={auth.currentUser.photoURL} size="xl" />
              <Heading size="md"> {auth.currentUser.displayName}</Heading>
              <Button
                rightIcon={<AiFillCamera />}
                size="md"
                as="label"
                htmlFor="image"
                bg={"blackAlpha.200"}
                _hover={{
                  bg: "blackAlpha.300",
                }}
                cursor="pointer"
                isLoading={loading}
                loadingText="Please wait..."
              >
                Change Avatar
              </Button>
              <input
                type="file"
                name="image"
                id="image"
                accept="image/*"
                style={{ display: "none" }}
                onChange={changeAvatar}
              />
              <Divider orientation="horizontal" borderWidth="3px" />
            </VStack>
            <Text textAlign="center" fontSize="md">
              {users.length} Participants
            </Text>
            <Box p={1}>
              {users.map((user) => (
                <HStack
                  key={user.id}
                  my={2}
                  _hover={{
                    bg: "gray.200",
                  }}
                  p={2}
                  borderRadius={10}
                  cursor="pointer"
                  onClick={() => setSelectedUser(user)}
                >
                  <Avatar src={user.photoURL} />
                  <Text>
                    {auth.currentUser.uid === user.id ? "You" : user.name}
                  </Text>
                </HStack>
              ))}
            </Box>
          </DrawerBody>

          <DrawerFooter>
            <Button
              colorScheme="red"
              mx="auto"
              onClick={() => auth.signOut()}
              rightIcon={<AiOutlineLogout />}
            >
              Logout
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <Modal
        isOpen={selectedUser !== null}
        onClose={() => setSelectedUser(null)}
        size={modalSize}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">
            {selectedUser && "User Details"}
          </ModalHeader>
          <ModalCloseButton />
          <Divider />
          <ModalBody>
            <VStack gap={1} alignItems="center">
              <Avatar src={selectedUser && selectedUser.photoURL} size="2xl" />
              <Text>{selectedUser && selectedUser.name}</Text>
              <Text>{selectedUser && selectedUser.email}</Text>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
