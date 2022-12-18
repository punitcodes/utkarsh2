import { getSession } from "next-auth/react";
import prisma from "libs/prisma";

import type { NextApiRequest, NextApiResponse } from "next";
import { Points } from "@prisma/client";

export default async function createPoints(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { sabhaId, points } = req.body as {
    sabhaId: number;
    points: { new?: Points[]; existing?: Points[] };
  };

  const session = await getSession({ req });

  try {
    if (session) {
      if (!!points?.new) {
        await prisma.points.createMany({
          data: points.new.map(
            ({ name, value, type, teamId = null, yuvakId = null }) => ({
              name,
              value,
              type,
              sabhaId,
              teamId,
              yuvakId,
            })
          ),
        });
      }

      if (!!points?.existing) {
        points.existing.forEach(async ({ id, value }) => {
          await prisma.points.update({
            where: { id },
            data: { value },
          });
        });
      }

      res.json({ ok: true });
    } else {
      res.status(401).send({ message: "Unauthorized" });
    }
  } catch (err) {
    console.log("err --->", err);
    res.status(500).send({ message: "Something went wrong" });
  }
}
