import prisma from "@/lib/prisma";

export default async function (req, res) {
  let { method } = req;

  if (method !== "GET") return res.status(400).send({ msg: "Bad request" });

  let sales = await prisma.ShipmentInquiries.aggregate({
    _sum: {
      quote: true,
      credit: true,
      debit: true,
    },
  });

  let shipments = await prisma.ShipmentInquiries.count({
    select: {
      id: true,
    },
  });

  return res.status(200).send({ ...sales?._sum, issues: shipments?.id });
}
