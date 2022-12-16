import { useCallback, useState } from "react";
import useSWRMutation from "swr/mutation";

import { axiosPost } from "libs";

import type { Points } from "@prisma/client";

export default function useGetPoints() {
  const [points, setPoints] = useState<
    Omit<Points, "createdAt" | "updatedAt">[]
  >([]);

  const { trigger: getPoints } = useSWRMutation(
    "/api/points/get-list",
    axiosPost<{ sabhaId: number }, Points[]>,
    {
      onSuccess(data) {
        const result = data.data.map(
          ({ id, name, value, type, sabhaId, yuvakId, teamId }) => ({
            id,
            name,
            value,
            type,
            sabhaId,
            yuvakId,
            teamId,
          })
        );

        setPoints(result);
      },
    }
  );

  return useCallback(async ({ sabhaId }: { sabhaId: number }) => {
    if (!sabhaId) return;

    await getPoints();

    return points;
  }, []);
}
