import prisma from "@/lib/prisma";
import { validatePayload } from "@/lib/utils";

export default async function all(req, res) {
  let { method } = req;

  var shipments;

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

  if (method === "POST") {
    let { status } = validatePayload(["email"], req);

    if (status) return res.status(400).send({ msg: status });

    let { email } = req.body ?? {};

    let user = await prisma.User.findUnique({
      where: { email },
      select: { id: true },
    });

    shipments = await prisma.ShipmentInquiries.findMany({
      where: { userId: user?.id },
      ...options,
    });
  } else if (method === "GET") {
    shipments = await prisma.ShipmentInquiries.findMany({ ...options });
  } else {
    return res.status(400).send({ msg: "Bad Request" });
  }

  return res.status(200).send(shipments);
}
