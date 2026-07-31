import type { FastifyInstance } from "fastify";
// plug in to set content parsing to json for all content types
export const configureContentTypeParsing = (fastify: FastifyInstance) => {
  fastify.removeAllContentTypeParsers();
  fastify.addContentTypeParser(
    "*",
    { parseAs: "string" },
    fastify.getDefaultJsonParser("ignore", "ignore"),
  );
};
