import prisma from "@/lib/prisma";
import { validatePayload } from "@/lib/utils";

export default async function (req, res) {
  let { method } = req;

  if (method !== "POST") return res.status(400).send({ msg: "Bad request" });

  let { status } = validatePayload(["issue"], req);

  if (status) return res.status(400).send({ msg: status });

  let { issue } = req.body ?? {};

  let issues = await prisma.Issues.findMany({
    where: {
      device: issue,
    },
    select: {
      device: true,
      problem: true,
      status: true,
      technician: true,
      credit: true,
      debit: true,
      quote: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return res.status(200).send({ issues });
}
