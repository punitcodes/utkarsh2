import { ReactNode } from "react";
import {
  Box,
  Flex,
  Avatar,
  Link,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  Center,
} from "@chakra-ui/react";
import { useSession, signIn, signOut } from "next-auth/react";

const NavLink = ({ children }: { children: ReactNode }) => (
  <Link
    px={2}
    py={1}
    rounded="md"
    _hover={{
      textDecoration: "none",
      bg: "gray.200",
    }}
    href="#"
  >
    {children}
  </Link>
);

export default function Header() {
  const { data: session } = useSession();

  return (
    <>
      <Box bg="gray.100" px={4}>
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <Link href="/home">
            <Box>Youthotsav</Box>
          </Link>

          <Flex alignItems="center">
            {session ? (
              <Menu>
                <MenuButton
                  as={Button}
                  rounded="full"
                  variant="link"
                  cursor="pointer"
                  minW={0}
                >
                  <Avatar
                    size="sm"
                    src={
                      session.user?.image ||
                      `https://avatars.dicebear.com/api/male/${session.user?.name}.svg`
                    }
                  />
                </MenuButton>
                <MenuList alignItems="center">
                  <br />
                  <Center>
                    <Avatar
                      size="2xl"
                      src={
                        session.user?.image ||
                        `https://avatars.dicebear.com/api/male/${session.user?.name}.svg`
                      }
                    />
                  </Center>
                  <br />
                  <Center>
                    <p>{session.user?.name}</p>
                  </Center>
                  <br />
                  <MenuDivider />
                  <MenuItem onClick={() => signOut()}>Logout</MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <Button
                display="inline-flex"
                fontSize="sm"
                fontWeight={600}
                onClick={() => signIn("auth0")}
              >
                Sign In
              </Button>
            )}
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
