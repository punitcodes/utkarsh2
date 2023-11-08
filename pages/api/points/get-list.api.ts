import prisma from "libs/prisma";

import type { NextApiRequest, NextApiResponse } from "next";
import { Points } from "@prisma/client";

export default async function getPointsList(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { sabhaId } = req.body as Points;

  try {
    const result = await prisma.points.findMany({
      where: {
        sabhaId: {
          [Array.isArray(sabhaId) ? "in" : "equals"]: sabhaId,
        },
      },
      orderBy: {
        id: "asc",
      },
    });
    res.json(result);
  } catch (err) {
    res.status(500).send({ message: "Something went wrong" });
  }
}
