import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Input,
} from "@chakra-ui/react";
import { flexRender, Column, Table as ReactTable } from "@tanstack/react-table";

type Props<T = any> = {
  table: ReactTable<T>;
};

const Filter = ({ column }: { column: Column<any, any> }) => {
  const columnFilterValue = column.getFilterValue();

  return (
    <Input
      value={(columnFilterValue ?? "") as string}
      onChange={(e) => column.setFilterValue(e.target.value)}
    />
  );
};

export default function PointsTable({ table }: Props) {
  return (
    <TableContainer>
      <Table
        variant="simple"
        size="sm"
        sx={{
          "th,td": {
            minWidth: "96px",
            maxWidth: "96px",

            whiteSpace: "initial",

            paddingInlineStart: 2,
            paddingInlineEnd: 2,

            py: 2,
          },
        }}
      >
        <Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Th key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder ? null : (
                    <>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getCanFilter() && header.id === "name" ? (
                        <Filter column={header.column} />
                      ) : null}
                    </>
                  )}
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>

        <Tbody>
          {table.getRowModel().rows.map((row) => (
            <Tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <Td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
