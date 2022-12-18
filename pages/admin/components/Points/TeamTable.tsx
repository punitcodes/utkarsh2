import { useState, useEffect } from "react";
import { Checkbox, Input } from "@chakra-ui/react";
import { createColumnHelper, getCoreRowModel } from "@tanstack/react-table";

import { useTeamPoints } from "../../hooks";

import type { Team, Points } from "@prisma/client";
import type { UseFormReturn } from "react-hook-form";
import PointsTable from "./PointsTable";

interface Props {
  teams: Omit<Team, "createdAt" | "updatedAt">[];
  points: Points[];
  hookForm: UseFormReturn<any, any>;
}

interface PointsObject {
  id: number;
  value: number;
}

interface TeamPoints {
  teamId: number;
  name: string;
  atmiyata: PointsObject;
  management: PointsObject;
  newYuvak: PointsObject;
  newRegistration: PointsObject;
  outPerf: PointsObject;
  others: PointsObject;
}

const columnHelper = createColumnHelper<TeamPoints>();

export default function TeamTable({ teams, points, hookForm }: Props) {
  const { setValue } = hookForm;

  const teamPoints = useTeamPoints(points);

  useEffect(() => {
    if (teams.length > 0 && !!teamPoints) {
      const updatedPoints = teams.map(({ id, name }) => ({
        teamId: id,
        name,
        atmiyata: teamPoints?.[id]?.atmiyata,
        management: teamPoints?.[id]?.management,
        newYuvak: teamPoints?.[id]?.newYuvak,
        newRegistration: teamPoints?.[id]?.newRegistration,
        outPerf: teamPoints?.[id]?.outPerf,
        others: teamPoints?.[id]?.others,
      }));

      setData(updatedPoints);
    }
  }, [teams, teamPoints]);

  const [data, setData] = useState<TeamPoints[]>(() => []);

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
        const val = info.getValue();
        const newOrExisting = val === undefined ? "new" : "existing";
        const pointsId = newOrExisting === "existing" ? `_${val.id}` : "";

        return (
          <Checkbox
            defaultChecked={val?.value > 0}
            colorScheme="green"
            onChange={({ target: { checked } }) =>
              setValue(
                `team_${teamId}_${info.column.id}_${newOrExisting}${pointsId}`,
                checked
              )
            }
          />
        );
      },
    }),
    columnHelper.accessor("management", {
      header: "Management",
      id: "management",
      cell: (info) => {
        const teamId = info.row.getValue("teamId");
        const val = info.getValue();
        const newOrExisting = val === undefined ? "new" : "existing";
        const pointsId = newOrExisting === "existing" ? `_${val.id}` : "";

        return (
          <Checkbox
            defaultChecked={val?.value > 0}
            colorScheme="green"
            onChange={({ target: { checked } }) =>
              setValue(
                `team_${teamId}_${info.column.id}_${newOrExisting}${pointsId}`,
                checked
              )
            }
          />
        );
      },
    }),
    columnHelper.accessor("newYuvak", {
      header: "New Yuvak",
      id: "newYuvak",
      cell: (info) => {
        const teamId = info.row.getValue("teamId");
        const val = info.getValue();
        const newOrExisting = val === undefined ? "new" : "existing";
        const pointsId = newOrExisting === "existing" ? `_${val.id}` : "";

        return (
          <Input
            width="64px"
            defaultValue={val?.value}
            onChange={({ target: { value } }) =>
              setValue(
                `team_${teamId}_${info.column.id}_${newOrExisting}${pointsId}`,
                value
              )
            }
          />
        );
      },
    }),
    columnHelper.accessor("newRegistration", {
      header: "New Reg",
      id: "newRegistration",
      cell: (info) => {
        const teamId = info.row.getValue("teamId");
        const val = info.getValue();
        const newOrExisting = val === undefined ? "new" : "existing";
        const pointsId = newOrExisting === "existing" ? `_${val.id}` : "";

        return (
          <Input
            width="64px"
            defaultValue={val?.value}
            onChange={({ target: { value } }) =>
              setValue(
                `team_${teamId}_${info.column.id}_${newOrExisting}${pointsId}`,
                value
              )
            }
          />
        );
      },
    }),
    columnHelper.accessor("outPerf", {
      header: "Outside Sabha Perf",
      id: "outPerf",
      cell: (info) => {
        const teamId = info.row.getValue("teamId");
        const val = info.getValue();
        const newOrExisting = val === undefined ? "new" : "existing";
        const pointsId = newOrExisting === "existing" ? `_${val.id}` : "";

        return (
          <Input
            width="64px"
            defaultValue={val?.value}
            onChange={({ target: { value } }) =>
              setValue(
                `team_${teamId}_${info.column.id}_${newOrExisting}${pointsId}`,
                value
              )
            }
          />
        );
      },
    }),
    columnHelper.accessor("others", {
      header: "Others",
      id: "others",
      cell: (info) => {
        const teamId = info.row.getValue("teamId");
        const val = info.getValue();
        const newOrExisting = val === undefined ? "new" : "existing";
        const pointsId = newOrExisting === "existing" ? `_${val.id}` : "";

        return (
          <Input
            width="64px"
            defaultValue={val?.value}
            onChange={({ target: { value } }) =>
              setValue(
                `team_${teamId}_${info.column.id}_${newOrExisting}${pointsId}`,
                value
              )
            }
          />
        );
      },
    }),
  ];

  const reactTableOptions = {
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnVisibility: {
        teamId: false,
      },
    },
  };

  return <PointsTable reactTableOptions={reactTableOptions} />;
}
