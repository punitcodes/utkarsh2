import { useState, useMemo, useEffect } from "react";
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

import { useTeamPoints } from "../../hooks";

import type { Team, Points } from "@prisma/client";
import type { UseFormReturn } from "react-hook-form";

interface Props {
  teams: Omit<Team, "createdAt" | "updatedAt">[];
  points: Points[];
  hookForm: UseFormReturn<any, any>;
}

interface TeamPoints {
  teamId: number; // teamId
  name: string;
  atmiyata: number;
  management: number;
}

const columnHelper = createColumnHelper<TeamPoints>();

export default function TeamTable({ teams, points, hookForm }: Props) {
  const { register } = hookForm;

  const teamPoints = useTeamPoints(points);

  const defaultData: TeamPoints[] = useMemo(() => {
    return teams.map(({ id, name }) => ({
      teamId: id,
      name,
      atmiyata: 0,
      management: 0,
    }));
  }, [teams, teamPoints]);

  useEffect(() => {
    if (teams.length > 0 && !!teamPoints) {
      const updatedPoints = teams.map(({ id, name }) => ({
        teamId: id,
        name,
        atmiyata: teamPoints?.[id]?.atmiyata,
        management: teamPoints?.[id]?.management,
      }));

      setData(updatedPoints);
    }
  }, [teams, teamPoints]);

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
        const checked = info.getValue() > 0;

        return (
          <Checkbox
            defaultChecked={checked}
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
        const checked = info.getValue() > 0;

        return (
          <Checkbox
            defaultChecked={checked}
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
