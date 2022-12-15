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

interface Props {
  yuvaks: {
    id: number;
    name: string;
    phone: string | null;
  }[];
}

export default function YuvakTable({ yuvaks }: Props) {
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
