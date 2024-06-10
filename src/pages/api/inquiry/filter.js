import prisma from "@/lib/prisma";
import { validatePayload } from "@/lib/utils";

export default async function filter(req, res) {
  let { method } = req;

  if (method !== "POST") return res.status(400).send({ msg: "Bad request" });

  var inquiries;

  var options = {
    select: {
      id: true,
      name: true,
      description: true,
      status: true,
      quote: true,
      from: true,
      to: true,
    },
    orderBy: [{ updatedAt: "desc" }],
  };

  let { type } = req.body ?? {};

  let filters = {};

  delete req.body.type;

  Object.entries(req.body).forEach(([id, value]) => {
    if (value !== "") {
      switch (id) {
        case "name":
          filters[id] = {
            contains: value,
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
    inquiries = await prisma.ShipmentInquiries.findMany({
      where: { OR: [filters] },
      ...options,
    });
  } else {
    let { email } = req.body ?? {};

    let user = await prisma.ShipmentInquiries.findUnique({
      where: { email },
      select: { id: true },
    });

    inquiries = await prisma.ShipmentInquiries.findMany({
      where: { AND: [{ userId: user?.id }, filters] },
      ...options,
    });
  }

  return res.status(200).send(inquiries);
}
