import prisma from "../../../lib/prisma";
import { validatePayload } from "../../../lib/utils";

export default async function (req, res) {
  let { method } = req;

  if (method !== "POST") return res.status(400).send({ msg: "Bad request" });

  let { status } = validatePayload(["email", "device", "problem"], req);

  if (status) return res.status(400).send({ msg: status });

  let { email, device, problem } = req.body ?? {};

  let user = await prisma.User.findUnique({
    where: { email },
    select: {
      id: true,
    },
  });

  if (!user.id) return res.status(500).send({ msg: "Please sign in first" });

  await prisma.Issues.create({
    data: {
      device,
      problem,
      userId: user.id,
    },
  });

  return res.status(200).send({ msg: "Your issue is received" });
}
