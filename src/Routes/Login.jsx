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
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { auth } from "../FireBase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useTitle } from "react-haiku";

const Login = () => {
  useTitle("Chat App | Login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
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
  return (
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
              <Link to="/register" style={{ color: "#3A98B9" }}>
                Sign Up
              </Link>
            </Text>
          </Stack>
        </form>
      </Box>
    </Flex>
  );
};

export default Login;
