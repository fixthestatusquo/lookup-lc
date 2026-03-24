import { FastifyPluginAsync } from "fastify";
import lookup, { formatResult } from "./lookup";

const fetch = async (request, reply) => {
  try {
    const email = (request.query as any)?.email || (request.body as any)?.email;
    if (!email) {
      return reply.code(400).send({ error: "email query param required" });
    }

    const isSubscribed = await lookup(email);
    return formatResult(isSubscribed);
  } catch (error: any) {
    console.error(error);
    return reply
      .code(500)
      .send({ isError: true, error: error.toString(), found: false });
  }
};

const httpRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post("/lookup", async (request, reply) => fetch(request, reply));
  fastify.get("/lookup", async (request, reply) => fetch(request, reply));
};

export default httpRoutes;
