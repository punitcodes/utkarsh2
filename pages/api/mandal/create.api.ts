import { getSession } from "next-auth/react";
import prisma from "libs/prisma";

import type { NextApiRequest, NextApiResponse } from "next";
import { Mandal } from "@prisma/client";

export default async function createMandal(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name } = req.body as Mandal;

  const session = await getSession({ req });

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
