import prisma from "@/lib/prisma";
import { validatePayload } from "@/lib/utils";

export default async function create(req, res) {
  let { method } = req;

  if (method !== "POST") return res.status(400).send({ msg: "Bad request" });

  let status = validatePayload(["email", "cargo"], req);

  if (status) return res.status(200).send({ msg: status });

  let { inquiry, email, cargo } = req?.body;

  let user = await prisma.User.findUnique({
    where: { email },
    select: {
      id: true,
    },
  });

  if (!user.id) return res.status(500).send({ msg: "Please sign in first" });

  if (cargo?.length === 0)
    return res
      .status(400)
      .send({ msg: "Cargo is empty, please fill the form" });

  // Mutation
  var data = cargo?.map((payload) => {
    payload.userId = user?.id;
    payload.quantity = parseInt(payload?.quantity);
    payload.weight = parseInt(payload?.weight);
    return payload;
  });

  await prisma.ShipmentInquiries.create({
    data: {
      userId: user?.id,
      name: inquiry?.name,
      description: inquiry?.description,
      Cargo: {
        createMany: {
          data,
        },
      },
    },
  });

  return res.status(200).send({ msg: "Your shipment is received" });
}
