import prisma from "@/lib/prisma";
import { validatePayload } from "@/lib/utils";

export default async function all(req, res) {
  let { method } = req;

  var issues;

  var options = {
    select: {
      id: true,
      device: true,
      problem: true,
      status: true,
      quote: true,
      technician: true,
    },
    orderBy: [
      {
        updatedAt: "desc",
      },
    ],
  };

  if (method === "POST") {
    let { status } = validatePayload(["email"], req);

    if (status) return res.status(400).send({ msg: status });

    let { email } = req.body ?? {};

    let user = await prisma.User.findUnique({
      where: { email },
      select: { id: true },
    });

    issues = await prisma.Issues.findMany({
      where: { userId: user?.id },
      ...options,
    });
  } else if (method === "GET") {
    issues = await prisma.Issues.findMany({ ...options });
  } else {
    return res.status(400).send({ msg: "Bad Request" });
  }

  return res.status(200).send(issues);
}
