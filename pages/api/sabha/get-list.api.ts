import prisma from "libs/prisma";

import type { NextApiRequest, NextApiResponse } from "next";
import type { Sabha } from "@prisma/client";

export default async function getSabhaList(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { mandalId } = req.body as Sabha;

  try {
    const result = await prisma.sabha.findMany({
      where: { mandalId },
    });
    res.json(result);
  } catch (err) {
    res.status(500).send({ message: "Something went wrong" });
  }
}
