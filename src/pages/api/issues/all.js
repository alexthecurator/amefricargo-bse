import prisma from "../../../lib/prisma";
import { validatePayload } from "../../../lib/utils";

export default async function (req, res) {
  let { method } = req;

  if (method !== "POST") return res.status(400).send({ msg: "Bad request" });

  let { status } = validatePayload(["email"], req);

  if (status) return res.status(400).send({ msg: status });

  let { email } = req.body ?? {};

  let user = await prisma.User.findUnique({
    where: { email },
    select: {
      id: true,
    },
  });

  let issues = await prisma.Issues.findMany({
    where: {
      userId: user?.id,
    },
    select: {
      device: true,
      problem: true,
      status: true,
      technician: true,
    },
  });

  return res.status(200).send(issues);
}
