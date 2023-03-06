import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { Flex, CircularProgress } from "@chakra-ui/react";
import { auth } from "../FireBase";

function PublicRoute() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <>
        <Flex h={"100vh"} align={"center"} justify={"center"}>
          <CircularProgress isIndeterminate color="green.300" />
        </Flex>
      </>
    );
  }
  if (!user) {
    return <Outlet />;
  }
  return <Navigate to="/" />;
}

export default PublicRoute;
