import prisma from "@/lib/prisma";
import { validatePayload } from "@/lib/utils";

export default async function get(req, res) {
  let { method } = req;

  if (method !== "POST") return res.status(400).send({ msg: "Bad request" });

  let { status } = validatePayload(["issue"], req);

  if (status) return res.status(400).send({ msg: status });

  let { inquiry } = req.body ?? {};

  let inq = await prisma.ShipmentInquiries.findUnique({
    where: {
      id: inquiry,
    },
    select: {
      Cargo: {
        select: {
          id: true,
          name: true,
          type: true,
          weight: true,
          quantity: true,
          dimensions: true,
          description: true,
        },
      },
      status: true,
      name: true,
      description: true,
      credit: true,
      debit: true,
      quote: true,
      from: true,
      to: true,
      User: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return res.status(200).send({ inquiry: inq });
}
