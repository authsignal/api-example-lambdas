import { Authsignal, UserAttributes } from "@authsignal/node";

const apiSecretKey = process.env.AUTHSIGNAL_SECRET!;
const apiUrl = process.env.AUTHSIGNAL_URL!;

export const authsignal = new Authsignal({ apiSecretKey, apiUrl });

export type UserContext = { userId: string } & UserAttributes;
