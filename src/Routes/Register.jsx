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
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, firestore } from "../FireBase";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useTitle } from "react-haiku";

const Register = () => {
  useTitle("Chat App | Register");
  const navigate = useNavigate();
  const toast = useToast();
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
  });
  const [alert, setAlert] = useState({
    open: false,
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (data.name.length < 4) {
      setAlert({
        open: true,
        message: "Please enter a valid name!",
      });
      return;
    } else if (data.password !== data.confirmPassword) {
      setAlert({
        open: true,
        message: "Passwords doesn't match!",
      });
      return;
    } else if (data.password.length < 8) {
      setAlert({
        open: true,
        message: "Password length is too short!",
      });
      return;
    }
    setLoading(true);
    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then(async (res) => {
        const user = res.user;
        await updateProfile(user, {
          displayName: data.name,
        });
        await setDoc(doc(firestore, "users", auth.currentUser.uid), {
          name: data.name,
          email: data.email,
        });
        toast({
          title: "Registration Successful!",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        navigate("/");
      })
      .catch((error) => {
        let errMsg = "";
        if (error.code === "auth/email-already-in-use") {
          errMsg = "Email already Exists!";
        } else if (error.code === "auth/invalid-email") {
          errMsg = "Please enter a valid email address!";
        } else {
          errMsg = error.code;
        }
        toast({
          title: errMsg,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setLoading(false);
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
          Create your account
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
              <FormLabel>Full Name</FormLabel>
              <Input
                type="text"
                autoComplete="off"
                value={data.name}
                onChange={(e) => {
                  setData({
                    ...data,
                    name: e.target.value,
                  });
                }}
              />
            </FormControl>
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
                  type={showPassword1 ? "text" : "password"}
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
                      setShowPassword1((showPassword1) => !showPassword1)
                    }
                  >
                    {showPassword1 ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Confirm Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword2 ? "text" : "password"}
                  autoComplete="off"
                  value={data.confirmPassword}
                  onChange={(e) => {
                    setData({
                      ...data,
                      confirmPassword: e.target.value,
                    });
                  }}
                />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      setShowPassword2((showPassword2) => !showPassword2)
                    }
                  >
                    {showPassword2 ? <ViewIcon /> : <ViewOffIcon />}
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
              Create Account
            </Button>
            <Text textAlign="center" fontSize="md">
              Already Have an Account?{" "}
              <Link to="/login" style={{ color: "#3A98B9" }}>
                Sign In
              </Link>
            </Text>
          </Stack>
        </form>
      </Box>
    </Flex>
  );
};

export default Register;
