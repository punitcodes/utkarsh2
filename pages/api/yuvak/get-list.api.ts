import { getSession } from "next-auth/react";
import prisma from "libs/prisma";

import type { NextApiRequest, NextApiResponse } from "next";
import { Yuvak } from "@prisma/client";

export default async function getYuvakList(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { mandalId } = req.body as Yuvak;

  const session = await getSession({ req });

  try {
    if (session) {
      const result = await prisma.yuvak.findMany({
        where: { mandalId },
        orderBy: { name: "asc" },
      });
      res.json(result);
    } else {
      res.status(401).send({ message: "Unauthorized" });
    }
  } catch (err) {
    res.status(500).send({ message: "Something went wrong" });
  }
}
