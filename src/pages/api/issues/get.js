import prisma from "@/lib/prisma";
import { validatePayload } from "@/lib/utils";

export default async function (req, res) {
  let { method } = req;

  if (method !== "POST") return res.status(400).send({ msg: "Bad request" });

  let { status } = validatePayload(["user"], req);

  if (status) return res.status(400).send({ msg: status });

  let { issue } = req.body ?? {};

  let issues = await prisma.Issues.findUnique({
    where: {
      id: issue,
    },
    select: {
      device: true,
      problem: true,
      status: true,
      technician: true,
    },
  });

  return res.status(200).send({ data: issues });
}
