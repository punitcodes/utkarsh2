import { useState, useEffect, ChangeEvent } from "react";
import { Checkbox, Input } from "@chakra-ui/react";
import { createColumnHelper, getCoreRowModel } from "@tanstack/react-table";

import { useYuvakPoints } from "../../hooks";

import type { Yuvak, Points } from "@prisma/client";
import type { UseFormReturn } from "react-hook-form";
import PointsTable from "./PointsTable";

interface Props {
  yuvaks: Omit<Yuvak, "createdAt" | "updatedAt">[];
  points: Points[];
  hookForm: UseFormReturn<any, any>;
}

interface PointsObject {
  id: number;
  value: number;
}

interface YuvakPoints {
  yuvakId: number;
  name: string;
  attendance: PointsObject;
  earlyBird: PointsObject;
  others: PointsObject;
}

const columnHelper = createColumnHelper<YuvakPoints>();

export default function YuvakTable({ yuvaks, points, hookForm }: Props) {
  const { setValue } = hookForm;

  const yuvakPoints = useYuvakPoints(points);

  useEffect(() => {
    if (yuvaks.length > 0 && !!yuvakPoints) {
      const updatedPoints = yuvaks.map(({ id, name }) => ({
        yuvakId: id,
        name,
        earlyBird: yuvakPoints?.[id]?.earlyBird,
        attendance: yuvakPoints?.[id]?.attendance,
        others: yuvakPoints?.[id]?.others,
      }));

      setData(updatedPoints);
    }
  }, [yuvaks, yuvakPoints]);

  console.log("yuvaks --->", yuvakPoints);

  const [data, setData] = useState<YuvakPoints[]>(() => []);

  const columns = [
    columnHelper.accessor("yuvakId", {
      id: "yuvakId",
    }),
    columnHelper.accessor("name", {
      header: "Name",
      id: "name",
    }),
    columnHelper.accessor("earlyBird", {
      header: "Early Bird",
      id: "earlyBird",
      cell: (info) => {
        const yuvakId = info.row.getValue("yuvakId");
        const val = info.getValue();
        const newOrExisting = val === undefined ? "new" : "existing";
        const pointsId = newOrExisting === "existing" ? `_${val.id}` : "";

        const handleChange = ({
          target: { checked },
        }: ChangeEvent<HTMLInputElement>) => {
          setValue(
            `yuvak_${yuvakId}_${info.column.id}_${newOrExisting}${pointsId}`,
            checked
          );

          setValue(
            `yuvak_${yuvakId}_attendance_${newOrExisting}${pointsId}`,
            checked
          );
        };

        return (
          <Checkbox
            defaultChecked={val?.value > 0}
            colorScheme="green"
            onChange={handleChange}
          />
        );
      },
    }),
    columnHelper.accessor("attendance", {
      header: "Attendance",
      id: "attendance",
      cell: (info) => {
        const yuvakId = info.row.getValue("yuvakId");
        const val = info.getValue();
        const newOrExisting = val === undefined ? "new" : "existing";
        const pointsId = newOrExisting === "existing" ? `_${val.id}` : "";

        return (
          <Checkbox
            defaultChecked={val?.value > 0}
            colorScheme="green"
            onChange={({ target: { checked } }) =>
              setValue(
                `yuvak_${yuvakId}_${info.column.id}_${newOrExisting}${pointsId}`,
                checked
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
        const yuvakId = info.row.getValue("yuvakId");
        const val = info.getValue();
        const newOrExisting = val === undefined ? "new" : "existing";
        const pointsId = newOrExisting === "existing" ? `_${val.id}` : "";

        return (
          <Input
            width="64px"
            defaultValue={val?.value}
            onChange={({ target: { value } }) =>
              setValue(
                `yuvak_${yuvakId}_${info.column.id}_${newOrExisting}${pointsId}`,
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
        yuvakId: false,
      },
    },
  };

  return <PointsTable reactTableOptions={reactTableOptions} />;
}
