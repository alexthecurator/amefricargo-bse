import axios from "axios";

const validEmail = (email) => {
  let emailRegExp =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return email.match(emailRegExp) ? true : false;
};

export function validatePayload(fields = [], req) {
  const { body } = req ?? {};

  let status = false;

  fields?.forEach((key) => {
    if (body[key] === undefined) status = `Missing ${key} field`;
    else if (body[key] === "") status = `${key} is empty`;
  });

  if ("email" in body && !validEmail(body["email"]))
    status = "Invalid email format";

  return status;
}

export var tzs = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "TZS",
});

export function trimming(val, size = 54) {
  return val.length > size ? `${val?.slice(0, size)}...` : val;
}

export const request = axios.create({
  baseURL: "http://localhost:3000/api/",
});
