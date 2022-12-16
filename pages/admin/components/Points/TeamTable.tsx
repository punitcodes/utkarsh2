import { useState } from "react";
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
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import type { Team, Points } from "@prisma/client";
import { UseFormReturn } from "react-hook-form";
import { useMemo } from "react";

interface Props {
  teams: Omit<Team, "createdAt" | "updatedAt">[];
  points: Omit<Points, "createdAt" | "updatedAt">[];
  hookForm: UseFormReturn<any, any>;
}

interface TeamPoints {
  teamId: number; // teamId
  name: string;
  atmiyata: boolean;
  management: boolean;
}

const columnHelper = createColumnHelper<TeamPoints>();

export default function TeamTable({ teams, points, hookForm }: Props) {
  const { register } = hookForm;
  const defaultData: TeamPoints[] = useMemo(() => {
    return teams.map(({ id, name }) => ({
      teamId: id,
      name,
      atmiyata: false,
      management: false,
    }));
  }, [teams]);

  const [data, setData] = useState(() => [...defaultData]);

  const columns = [
    columnHelper.accessor("teamId", {
      id: "teamId",
    }),
    columnHelper.accessor("name", {
      header: "Name",
      id: "name",
    }),
    columnHelper.accessor("atmiyata", {
      header: "Atmiyata",
      id: "atmiyata",
      cell: (info) => {
        const teamId = info.row.getValue("teamId");

        return (
          <Checkbox
            checked={info.getValue()}
            colorScheme="green"
            {...register(`team_${teamId}_atmiyata`)}
          />
        );
      },
    }),
    columnHelper.accessor("management", {
      header: "Management",
      id: "management",
      cell: (info) => {
        const teamId = info.row.getValue("teamId");

        return (
          <Checkbox
            checked={info.getValue()}
            colorScheme="green"
            {...register(`team_${teamId}_management`)}
          />
        );
      },
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnVisibility: {
        teamId: false,
      },
    },
  });

  return (
    <TableContainer>
      <Table variant="simple">
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
