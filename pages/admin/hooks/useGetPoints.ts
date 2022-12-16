import { useCallback, useState } from "react";
import useSWRMutation from "swr/mutation";

import { axiosPost } from "libs";

import type { Points } from "@prisma/client";

export default function useGetPoints() {
  const { trigger: getPoints } = useSWRMutation(
    "/api/points/get-list",
    axiosPost<{ sabhaId: number }, Points[]>
  );

  return useCallback(async ({ sabhaId }: { sabhaId: number }) => {
    if (!sabhaId) return [];

    const result = await getPoints({ sabhaId });

    return result?.data || [];
  }, []);
}
