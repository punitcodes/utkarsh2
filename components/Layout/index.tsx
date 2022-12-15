import { useEffect, ReactNode } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Box, Center } from "@chakra-ui/react";

import Nav from "components/Header";
import Seo from "components/Seo";

interface Props {
  children: ReactNode;
  needAuth?: boolean;
}

export default function Layout({ children, needAuth = false }: Props) {
  const router = useRouter();
  const { status: sessionStatus } = useSession();

  useEffect(() => {
    if (needAuth && sessionStatus === "unauthenticated") router.push("/");
  }, [needAuth, sessionStatus]);

  if (sessionStatus === "loading") return <Box>Loading...</Box>;

  return (
    <>
      <Seo />
      <Nav />

      <Center p="4">
        <Box w="100%" maxW="480px">
          {children}
        </Box>
      </Center>
    </>
  );
}
