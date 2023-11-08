import { getServerSession } from "next-auth/next";
import prisma from "libs/prisma";

import type { NextApiRequest, NextApiResponse } from "next";
import { Mandal } from "@prisma/client";
import { authOptions } from "../auth/[...nextauth].api";

export default async function createMandal(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name } = req.body as Mandal;

  const session = await getServerSession(req, res, authOptions);

  try {
    if (session) {
      const result = await prisma.mandal.create({
        data: {
          name,
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
