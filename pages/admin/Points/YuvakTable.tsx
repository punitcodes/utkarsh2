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
} from "@chakra-ui/react";

import type { Yuvak, Points } from "@prisma/client";

interface Props {
  yuvaks: Omit<Yuvak, "createdAt" | "updatedAt">[];
  points: Omit<Points, "createdAt" | "updatedAt">[];
}

export default function YuvakTable({ yuvaks, points }: Props) {
  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>Name</Tr>
        </Thead>

        <Tbody>
          {yuvaks.map(({ id, name }) => (
            <Tr key={id}>
              <Td>{name}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
