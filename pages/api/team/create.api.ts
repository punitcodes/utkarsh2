import { getServerSession } from "next-auth/next";
import prisma from "libs/prisma";

import type { NextApiRequest, NextApiResponse } from "next";
import { Team } from "@prisma/client";
import { authOptions } from "../auth/[...nextauth].api";

export default async function createTeam(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name, mandalId } = req.body as Team;

  const session = await getServerSession(req, res, authOptions);

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
