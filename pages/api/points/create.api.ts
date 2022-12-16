import { getSession } from "next-auth/react";
import prisma from "libs/prisma";

import type { NextApiRequest, NextApiResponse } from "next";
import { Points } from "@prisma/client";

export default async function createPoints(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { sabhaId, points } = req.body as { sabhaId: number; points: Points[] };

  const session = await getSession({ req });

  try {
    if (session) {
      const result = await prisma.points.createMany({
        data: points.map(({ name, value, type, teamId, yuvakId }) => ({
          name,
          value,
          type,
          sabhaId,
          teamId,
          yuvakId,
        })),
      });
      res.json(result);
    } else {
      res.status(401).send({ message: "Unauthorized" });
    }
  } catch (err) {
    console.log("err --->", err);
    res.status(500).send({ message: "Something went wrong" });
  }
}
