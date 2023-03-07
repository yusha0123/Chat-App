import React from "react";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  Text,
  InputGroup,
  InputRightElement,
  Alert,
  AlertIcon,
  CloseButton,
  useToast,
  Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon, EmailIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { auth } from "../FireBase";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useTitle } from "react-haiku";

const Login = () => {
  useTitle("Chat App | Login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const modalSize = useBreakpointValue({ base: "xs", md: "md", xl: "xl" });
  const navigate = useNavigate();
  const toast = useToast();
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [alert, setAlert] = useState({
    open: false,
    message: "",
  });
  const [modal, setModal] = useState({
    open: false,
    email: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (data.email.length < 6 || data.password.length < 6) {
      setAlert({
        open: true,
        message: "Invalid email/password credentials!",
      });
      return;
    }
    setLoading(true);
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        let errMsg = "";
        if (
          error.code === "auth/wrong-password" ||
          error.code === "auth/user-not-found"
        ) {
          errMsg = "Invalid Credentials!";
        } else if (error.code === "auth/invalid-email") {
          errMsg = "Please enter a valid email address!";
        } else {
          errMsg = error.code;
        }
        setLoading(false);
        toast({
          title: errMsg,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  const sendEmail = (e) => {
    e.preventDefault();
    setLoading1(true);
    sendPasswordResetEmail(auth, modal.email)
      .then(() => {
        toast({
          title: "Password reset email sent!",
          description: "Don't forget to check your spam folder.",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      })
      .catch((error) => {
        let errCode = "";
        let errMsg = "";
        if (error.code === "auth/invalid-email") {
          errCode = "Invalid Email Address!";
          errMsg = "Please retry with a valid Email Address.";
        } else if (error.code === "auth/user-not-found") {
          errCode = "User Doesn't Exist!";
          errMsg = "Please retry with the email associated with your account.";
        } else {
          errCode = error.code;
          errMsg = error.message;
        }
        toast({
          title: errCode,
          description: errMsg,
          status: "error",
          duration: 6000,
          isClosable: true,
          position: "top",
        });
      })
      .finally(() => {
        setModal({
          open: false,
          email: "",
        });
        setLoading1(false);
      });
  };
  return (
    <>
      <Flex minH={"100vh"} align={"center"} justify={"center"} bg="gray.200">
        <Box
          rounded={"lg"}
          bg="white"
          boxShadow={"lg"}
          py={8}
          px={6}
          w={{ base: "90%", md: "50%", lg: "30%" }}
        >
          <Heading fontSize={"2xl"} textAlign="center" mb={6}>
            Sign in to your account
          </Heading>
          <form onSubmit={handleSubmit}>
            <Stack spacing={1}>
              {alert.open && (
                <Alert status="error" borderRadius={8}>
                  <AlertIcon />
                  {alert.message}
                  <CloseButton
                    onClick={() => {
                      setAlert({
                        open: false,
                        message: "",
                      });
                    }}
                    ml="auto"
                  />
                </Alert>
              )}
              <FormControl isRequired>
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  autoComplete="off"
                  value={data.email}
                  onChange={(e) => {
                    setData({
                      ...data,
                      email: e.target.value,
                    });
                  }}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    autoComplete="off"
                    value={data.password}
                    onChange={(e) => {
                      setData({
                        ...data,
                        password: e.target.value,
                      });
                    }}
                  />
                  <InputRightElement h={"full"}>
                    <Button
                      variant={"ghost"}
                      onClick={() =>
                        setShowPassword((showPassword) => !showPassword)
                      }
                    >
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
            </Stack>
            <Stack spacing={3} mt={3}>
              <Button
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.600",
                }}
                type="submit"
                isLoading={loading}
              >
                Continue
              </Button>
              <Text textAlign="center" fontSize="md">
                Don't have an account?{" "}
                <Button
                  colorScheme="teal"
                  variant="link"
                  onClick={() => navigate("/register")}
                >
                  Sign Up
                </Button>
              </Text>
              <Divider />
              <Button
                colorScheme="teal"
                variant="link"
                onClick={() => {
                  setModal({
                    ...modal,
                    open: true,
                  });
                }}
              >
                Forgot Password ?
              </Button>
            </Stack>
          </form>
        </Box>
      </Flex>
      <Modal
        isOpen={modal.open}
        onClose={() => {
          setModal({
            open: false,
            email: "",
          });
        }}
        size={modalSize}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">Reset Password</ModalHeader>
          <ModalCloseButton />
          <Divider />
          <ModalBody>
            <form onSubmit={sendEmail}>
              <Stack spacing={3} alignItems="center">
                <FormControl isRequired>
                  <FormLabel>Email address</FormLabel>
                  <Input
                    type="email"
                    placeholder="Type your response here"
                    value={modal.email}
                    onChange={(e) => {
                      setModal({
                        ...modal,
                        email: e.target.value,
                      });
                    }}
                  />
                </FormControl>
                <Button
                  leftIcon={<EmailIcon />}
                  colorScheme="messenger"
                  type="submit"
                  isLoading={loading1}
                  loadingText="Please wait..."
                >
                  Send Email
                </Button>
              </Stack>
            </form>
          </ModalBody>
          <Divider />
          <ModalFooter>
            <Button
              colorScheme="red"
              mr={3}
              onClick={() => {
                setModal({
                  ...modal,
                  open: false,
                });
              }}
              mx="auto"
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Login;
