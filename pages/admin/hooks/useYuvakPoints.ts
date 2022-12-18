// @ts-nocheck

import { useState, useEffect } from "react";
import { Points } from "@prisma/client";

interface YuvakPoints {
  [yuvakId: number]: { [name: string]: { id: number; value: number } };
}

export default function useYuvakPoints(points: Points[]): YuvakPoints {
  const [yuvakPoints, setYuvakPoints] = useState<YuvakPoints>({});

  useEffect(() => {
    // Create a hash map to store the points for each yuvak
    const pointsByYuvak: YuvakPoints = {};
    for (const point of points) {
      if (point.type === "yuvak") {
        if (!pointsByYuvak[point.yuvakId]) {
          pointsByYuvak[point.yuvakId] = {};
        }
        pointsByYuvak[point.yuvakId][point.name] = {
          id: point.id,
          value: point.value,
        };
      }
    }

    setYuvakPoints(pointsByYuvak);
  }, [points]);

  return yuvakPoints;
}
