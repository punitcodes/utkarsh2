import { useState, useMemo, useEffect } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { flexRender, useReactTable, TableOptions } from "@tanstack/react-table";

type Props<T = any> = {
  reactTableOptions: TableOptions<T>;
};

export default function PointsTable({ reactTableOptions }: Props) {
  const table = useReactTable(reactTableOptions);

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
                <Th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
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
