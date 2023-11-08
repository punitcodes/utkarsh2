import { getServerSession } from "next-auth/next";
import prisma from "libs/prisma";

import type { NextApiRequest, NextApiResponse } from "next";
import { Yuvak } from "@prisma/client";
import { authOptions } from "../auth/[...nextauth].api";

export default async function createYuvak(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { yuvaks } = req.body as { yuvaks: Yuvak[] };

  const session = await getServerSession(req, res, authOptions);

  try {
    if (session) {
      const result = await prisma.yuvak.createMany({
        data: yuvaks.map(({ name, role, phone, mandalId, teamId }) => ({
          name,
          role,
          phone,
          mandalId,
          teamId,
        })),
      });

      res.json(result);
    } else {
      res.status(401).send({ message: "Unauthorized" });
    }
  } catch (err) {
    res.status(500).send({ message: "Something went wrong" });
  }
}
