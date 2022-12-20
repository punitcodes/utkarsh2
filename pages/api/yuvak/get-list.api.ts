import prisma from "libs/prisma";

import type { NextApiRequest, NextApiResponse } from "next";
import type { Yuvak } from "@prisma/client";

export default async function getYuvakList(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { mandalId } = req.body as Yuvak;

  try {
    const result = await prisma.yuvak.findMany({
      where: { mandalId },
      orderBy: { name: "asc" },
    });
    res.json(result);
  } catch (err) {
    res.status(500).send({ message: "Something went wrong" });
  }
}
