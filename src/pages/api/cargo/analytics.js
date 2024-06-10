import prisma from "@/lib/prisma";

export default async function (req, res) {
  let { method } = req;

  if (method !== "GET") return res.status(400).send({ msg: "Bad request" });

  let sales = await prisma.Issues.aggregate({
    _sum: {
      quote: true,
      credit: true,
      debit: true,
    },
  });

  let issues = await prisma.Issues.count({
    select: {
      id: true,
    },
  });

  return res.status(200).send({ ...sales?._sum, issues: issues?.id });
}
