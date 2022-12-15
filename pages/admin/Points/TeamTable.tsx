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

interface Props {
  teams: { id: number; name: string }[];
}

export default function TeamTable({ teams }: Props) {
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
