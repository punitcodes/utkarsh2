import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "libs/prisma";
import { getSession } from "next-auth/react";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name } = req.body;

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
