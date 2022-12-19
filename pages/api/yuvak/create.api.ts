import { getSession } from "next-auth/react";
import prisma from "libs/prisma";

import type { NextApiRequest, NextApiResponse } from "next";
import { Yuvak } from "@prisma/client";

export default async function createYuvak(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { yuvaks } = req.body as { yuvaks: Yuvak[] };

  const session = await getSession({ req });

  console.log("yuvaks is", typeof yuvaks);

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
    console.log("err", err);
    res.status(500).send({ message: "Something went wrong" });
  }
}
