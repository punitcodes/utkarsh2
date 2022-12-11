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
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { useSession, signIn, signOut } from "next-auth/react";

const NavLink = ({ children }: { children: ReactNode }) => (
  <Link
    px={2}
    py={1}
    rounded="md"
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("gray.200", "gray.700"),
    }}
    href="#"
  >
    {children}
  </Link>
);

export default function Nav() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: session } = useSession();

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <Box>Youthotsav</Box>

          <Flex alignItems="center">
            <Stack direction="row" spacing={7}>
              <Button onClick={toggleColorMode}>
                {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              </Button>

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
                  display={{ base: "none", md: "inline-flex" }}
                  fontSize="sm"
                  fontWeight={600}
                  color="white"
                  onClick={() => signIn("auth0")}
                >
                  Sign In
                </Button>
              )}
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
