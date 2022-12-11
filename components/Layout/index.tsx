import { ReactNode } from "react";

import Nav from "components/Header";
import Seo from "components/Seo";
import { Box } from "@chakra-ui/react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Seo />
      <Nav />

      <Box p="4">{children}</Box>
    </>
  );
}
