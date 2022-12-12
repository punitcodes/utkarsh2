import { getSession } from "next-auth/react";
import prisma from "libs/prisma";

import type { NextApiRequest, NextApiResponse } from "next";
import { Yuvak } from "@prisma/client";

export default async function createYuvak(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name, role, phone, mandalId, teamId } = req.body as Yuvak;

  const session = await getSession({ req });

  try {
    if (session) {
      const result = await prisma.yuvak.create({
        data: {
          name,
          role,
          phone,
          mandalId,
          teamId,
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
