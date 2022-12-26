import { ReactNode } from "react";
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

const Links = [
  { title: "Home", href: "/home", needAuth: false },
  { title: "Admin", href: "/admin", needAuth: true },
];

const NavLink = ({ children, href }: { children: ReactNode; href: string }) => (
  <Link
    px={2}
    py={1}
    rounded="md"
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("gray.200", "gray.700"),
    }}
    href={href}
  >
    {children}
  </Link>
);

export default function Nav() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: session } = useSession();

  return (
    <>
      <Box bg="gray.100" px={4}>
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <IconButton
            size="md"
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label="Open Menu"
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems="center">
            <Box>
              <Image src="/logo.png" alt="youthostav" height={48} width={115} />
            </Box>
            <HStack as="nav" spacing={4} display={{ base: "none", md: "flex" }}>
              {Links.map(
                ({ title, href, needAuth }, index) =>
                  ((needAuth && session) || !needAuth) && (
                    <NavLink key={index} href={href}>
                      {title}
                    </NavLink>
                  )
              )}
            </HStack>
          </HStack>
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
                      session?.user?.image ||
                      `https://avatars.dicebear.com/api/male/${session.user?.name}.svg`
                    }
                  />
                </MenuButton>
                <MenuList>
                  <MenuItem>{session?.user?.name}</MenuItem>

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

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as="nav" spacing={4}>
              {Links.map(
                ({ title, href, needAuth }, index) =>
                  ((needAuth && session) || !needAuth) && (
                    <NavLink key={index} href={href}>
                      {title}
                    </NavLink>
                  )
              )}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
