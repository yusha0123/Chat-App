import React, { lazy, Suspense } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./utils/PrivateRoute";
import PublicRoute from "./utils/PublicRoute";
import { Flex, CircularProgress } from "@chakra-ui/react";

function App() {
  const Chat = lazy(() => import("./Routes/Chat"));
  const Login = lazy(() => import("./Routes/Login"));
  const Register = lazy(() => import("./Routes/Register"));

  return (
    <Suspense
      fallback={
        <Flex h={"100vh"} align={"center"} justify={"center"}>
          <CircularProgress isIndeterminate color="green.300" />
        </Flex>
      }
    >
      <Router>
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route element={<Chat />} path="/" exact />
          </Route>
          <Route element={<PublicRoute />}>
            <Route element={<Login />} path="/login" exact />
            <Route element={<Register />} path="/register" exact />
          </Route>
        </Routes>
      </Router>
    </Suspense>
  );
}

export default App;
