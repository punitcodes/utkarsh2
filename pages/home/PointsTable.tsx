// @ts-nocheck --- fix type

import {
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { PointsMap } from "./constant";

interface Props {
  pointsByTeam: { [key: string]: string | number }[];
}

export default function PointsByTeam({ pointsByTeam }: Props) {
  const points = useMemo(() => {
    return pointsByTeam.map(({ teamId, teamName, ...rest }) => {
      const allPoints = {};

      Object.keys(rest).forEach((e) => {
        allPoints[e] = PointsMap[e] * rest[e];
      });

      const total = Object.keys(allPoints).reduce(
        (acc, cur) => acc + allPoints[cur],
        0
      );

      return { teamId, teamName, ...allPoints, total };
    });
  }, [pointsByTeam]);

  return (
    <TableContainer>
      <Table size="sm">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Team Atmiyata</Th>
            <Th>Team Management</Th>
            <Th>New Yuvak</Th>
            <Th>New Registration</Th>
            <Th>Outside Sabha Perf</Th>
            <Th>EarlyBird</Th>
            <Th>Attendance</Th>
            <Th>Dress</Th>
            <Th>Others</Th>
            <Th>Total</Th>
          </Tr>
        </Thead>

        <Tbody>
          {points.map(
            ({
              teamId,
              teamName,
              atmiyata,
              management,
              newYuvak,
              newRegistration,
              outPerf,
              earlyBird,
              attendance,
              dress,
              others,
              total,
            }) => (
              <Tr key={teamId}>
                <Td>{teamName}</Td>
                <Td>{atmiyata ?? 0}</Td>
                <Td>{management ?? 0}</Td>
                <Td>{newYuvak ?? 0}</Td>
                <Td>{newRegistration ?? 0}</Td>
                <Td>{outPerf ?? 0}</Td>
                <Td>{earlyBird ?? 0}</Td>
                <Td>{attendance ?? 0}</Td>
                <Td>{dress ?? 0}</Td>
                <Td>{others ?? 0}</Td>
                <Td>{total ?? 0}</Td>
              </Tr>
            )
          )}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
