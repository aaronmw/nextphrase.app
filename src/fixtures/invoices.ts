import { type Invoice } from "@/app/types";

export default [
  {
    id: "1",
    amount: 5000,
    companyIdOfCreditor: "1",
    companyIdOfDebtor: "2",
    currencyCode: "USD",
    dateDue: new Date(),
    isAscertained: true,
  },
  {
    id: "2",
    amount: 10000,
    companyIdOfCreditor: "2",
    companyIdOfDebtor: "1",
    currencyCode: "USD",
    dateDue: new Date(),
    isAscertained: true,
  },
  {
    id: "3",
    amount: 250,
    companyIdOfCreditor: "2",
    companyIdOfDebtor: "1",
    currencyCode: "USD",
    dateDue: new Date(),
    isAscertained: true,
  },
] as Invoice[];
