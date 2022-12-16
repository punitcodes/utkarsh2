import { getSession } from "next-auth/react";
import prisma from "libs/prisma";

import type { NextApiRequest, NextApiResponse } from "next";
import { Team } from "@prisma/client";

export default async function createTeam(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name, mandalId } = req.body as Team;

  const session = await getSession({ req });

  try {
    if (session) {
      const result = await prisma.team.create({
        data: {
          name,
          mandalId,
        },
      });
      res.json(result);
    } else {
      res.status(401).send({ message: "Unauthorized" });
    }
  } catch (err) {
    res.status(500).send({ message: "Something went wrong" });
  }
}
