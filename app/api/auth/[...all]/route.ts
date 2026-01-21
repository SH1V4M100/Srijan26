import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { toNodeHandler } from "better-auth/node"
// Disallow body parsing, we will parse it manually
export const config = { api: { bodyParser: false } }
export default toNodeHandler(auth.handler)
export const { POST, GET } = toNextJsHandler(auth);