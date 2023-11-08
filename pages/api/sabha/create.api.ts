import { getServerSession } from "next-auth/next";
import prisma from "libs/prisma";

import type { NextApiRequest, NextApiResponse } from "next";
import { Sabha } from "@prisma/client";
import { authOptions } from "../auth/[...nextauth].api";

export default async function createSabha(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { date, mandalId } = req.body as Sabha;

  const session = await getServerSession(req, res, authOptions);

  try {
    if (session) {
      const result = await prisma.sabha.create({
        data: {
          date,
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
