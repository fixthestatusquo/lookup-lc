import type { FastifyInstance } from "fastify";

// Clients send inconsistent or missing Content-Type headers, and Fastify
// only parses bodies it recognizes as JSON — so we relabel any body as
// JSON before parsing happens. Bodyless requests (e.g. a bare
// `POST /lookup?email=...`) are left alone: Fastify treats an empty body
// tagged as application/json as an error instead of just an empty object.
export const configureContentTypeParsing = (fastify: FastifyInstance) => {
  fastify.addHook("onRequest", (request, _reply, done) => {
    const hasBody =
      Number(request.headers["content-length"] || 0) > 0 ||
      request.headers["transfer-encoding"] !== undefined;
    if (hasBody) {
      request.headers["content-type"] = "application/json";
    }
    done();
  });
};
