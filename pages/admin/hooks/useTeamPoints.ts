// @ts-nocheck

import { useState, useEffect } from "react";
import { Points } from "@prisma/client";

interface TeamPoints {
  [teamId: number]: { [name: string]: number };
}

export default function useTeamPoints(points: Points[]): TeamPoints {
  const [teamPoints, setTeamPoints] = useState<TeamPoints>({});

  useEffect(() => {
    // Create a hash map to store the points for each team
    const pointsByTeam: TeamPoints = {};
    for (const point of points) {
      if (!pointsByTeam[point.teamId]) {
        pointsByTeam[point.teamId] = {};
      }
      pointsByTeam[point.teamId][point.name] = point.value;
    }

    setTeamPoints(pointsByTeam);
  }, [points]);

  return teamPoints;
}
