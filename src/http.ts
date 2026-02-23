import { FastifyPluginAsync } from "fastify";
import lookup, { formatResult } from "./lookup";

const httpRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post("/lookup", async (request, reply) => {
    try {
      const email = (request.query as any)?.email;
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
  });
};

export default httpRoutes;
