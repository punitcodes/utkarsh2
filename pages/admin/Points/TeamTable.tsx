import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Checkbox,
} from "@chakra-ui/react";

import type { Team, Points } from "@prisma/client";

interface Props {
  teams: Omit<Team, "createdAt" | "updatedAt">[];
  points: Omit<Points, "createdAt" | "updatedAt">[];
}

export default function TeamTable({ teams, points }: Props) {
  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Atmiyata</Th>
            <Th>Management</Th>
          </Tr>
        </Thead>

        <Tbody>
          {teams.map(({ id, name }) => (
            <Tr key={id}>
              <Td>{name}</Td>
              <Td>
                <Checkbox colorScheme="green" />
              </Td>
              <Td>
                <Checkbox colorScheme="green" />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
