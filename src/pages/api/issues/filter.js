import prisma from "@/lib/prisma";
import { validatePayload } from "@/lib/utils";

export default async function (req, res) {
  let { method } = req;

  if (method !== "POST") return res.status(400).send({ msg: "Bad request" });

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

  let { type } = req.body ?? {};

  let filters = {};

  delete req.body.type;

  Object.entries(req.body).forEach(([id, value]) => {
    if (value !== "") {
      switch (id) {
        case "device":
          filters[id] = {
            contains: value,
          };
          break;
        case "createdAt":
          filters[id] = {
            gte: new Date(value),
          };
          break;
        default:
          filters[id] = {
            equals: value,
          };
          break;
      }
    }
  });

  if (type === "admin") {
    issues = await prisma.Issues.findMany({
      where: { OR: [filters] },
      ...options,
    });
  } else {
    let { email } = req.body ?? {};

    let user = await prisma.User.findUnique({
      where: { email },
      select: { id: true },
    });

    issues = await prisma.Issues.findMany({
      where: { AND: [{ userId: user?.id }, filters] },
      ...options,
    });
  }

  return res.status(200).send(issues);
}
