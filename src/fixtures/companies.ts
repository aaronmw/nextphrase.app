import { Company } from "@/app/types";

export default [
  {
    id: "1",
    country: "CA",
    dateCreated: new Date(),
    defaultCurrencyCode: "CAD",
    email: "aaronmw@gmail.com",
    emailVerified: true,
    name: "Aaron's Company",
  },
  {
    id: "2",
    country: "CA",
    dateCreated: new Date(),
    defaultCurrencyCode: "CAD",
    email: "someone.else@gmail.com",
    emailVerified: true,
    name: "ACME Corporation",
  },
] as Company[];
