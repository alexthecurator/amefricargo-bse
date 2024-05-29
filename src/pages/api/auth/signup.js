import prisma from "@/lib/prisma";
import CryptoJS from "crypto-js";
import { validatePayload } from "@/lib/utils";

export default async function (req, res) {
  let { method } = req;

  if (method !== "POST") return res.status(400).send({ msg: "Bad request" });

  let { status } = validatePayload(["name", "email", "image", "password"], req);

  if (status) return res.status(400).send({ msg: status });

  let { name, email, image, password } = req.body ?? {};

  let user = await prisma.User.create({
    data: {
      name,
      email,
      image,
    },
    select: {
      id: true,
    },
  });

  if (!user?.id)
    return res
      .status(400)
      .send({ msg: "Something went wrong.. Please try again" });

  let hashed = CryptoJS.SHA512(password).toString(CryptoJS.enc.Base64);

  let acc = await prisma.Password.create({
    data: {
      password: hashed,
      userId: user?.id,
    },
    select: {
      id: true,
    },
  });

  if (!acc?.id)
    return res
      .status(400)
      .send({ msg: "Something went wrong.. Please try again" });

  return res.status(200).send({ msg: `${email} has joined` });
}
