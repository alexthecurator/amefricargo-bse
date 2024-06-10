import prisma from "@/lib/prisma";

export default async function (req, res) {
  let { method } = req;

  if (method !== "PUT") return res.status(400).send({ msg: "Bad request" });

  let data = {};

  Object.entries(req.body).forEach(([id, value]) => {
    ["quote", "credit", "debit"].includes(id)
      ? (data[id] = parseFloat(value))
      : ["from", "to"].includes(id)
      ? (data[id] = new Date(value))
      : id !== "issue"
      ? (data[id] = value)
      : false;
  });

  let { issue } = req.body ?? {};

  let issues = await prisma.ShipmentInquiries.update({
    where: { id: issue },
    data,
  });

  return res.status(200).send({ issues });
}
