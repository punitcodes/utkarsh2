import prisma from "libs/prisma";

import type { NextApiRequest, NextApiResponse } from "next";
import type { Team } from "@prisma/client";

export default async function getTeamList(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { mandalId } = req.body as Team;

  try {
    const result = await prisma.team.findMany({
      where: { mandalId },
      orderBy: { name: "asc" },
    });
    res.json(result);
  } catch (err) {
    res.status(500).send({ message: "Something went wrong" });
  }
}
