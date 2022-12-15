import { getSession } from "next-auth/react";
import prisma from "libs/prisma";

import type { NextApiRequest, NextApiResponse } from "next";
import { Points } from "@prisma/client";

export default async function getPointsList(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { sabhaId } = req.body as Points;

  const session = await getSession({ req });

  try {
    if (session) {
      const result = await prisma.points.findMany({
        where: { sabhaId },
      });
      res.json(result);
    } else {
      res.status(401).send({ message: "Unauthorized" });
    }
  } catch (err) {
    console.log("err ->", err);
    res.status(500).send({ message: "Something went wrong" });
  }
}
