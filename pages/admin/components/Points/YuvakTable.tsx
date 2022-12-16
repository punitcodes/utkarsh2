import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Checkbox,
} from "@chakra-ui/react";

import type { Yuvak, Points } from "@prisma/client";
import { UseFormReturn } from "react-hook-form";

interface Props {
  yuvaks: Omit<Yuvak, "createdAt" | "updatedAt">[];
  points: Omit<Points, "createdAt" | "updatedAt">[];
  hookForm: UseFormReturn<any, any>;
}

export default function YuvakTable({ yuvaks, points, hookForm }: Props) {
  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Early Bird</Th>
            <Th>Attend</Th>
            <Th>Dress</Th>
          </Tr>
        </Thead>

        <Tbody>
          {yuvaks.map(({ id, name }) => (
            <Tr key={id}>
              <Td>{name}</Td>
              <Td>
                <Checkbox colorScheme="green" />
              </Td>
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
