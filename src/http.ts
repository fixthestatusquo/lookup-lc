import Fastify from 'fastify'
import { fetchHashes, updateDB } from './update';
import dotenv from 'dotenv';

dotenv.config();

const fastify = Fastify({
  logger: true
});


const lookupSchema = {
  body: {
    type: "object",
        required: ['email'],
    properties: {
      email: { type: "string" },
    },
  },
};


const emailLookup = async (email: string, reply) => {
  console.log("ivana, do the lookup here");
  const result = { status: 200 };
  console.log("ivana, do the lookup here");
  let code = 200;
  let details = {};
  details = { action: { customFields: { isSubscribed: true } } };

  console.log(`Return ${code}:`, details);
  reply
    .code(code)
    .type ("application/json")
//    .header("Content-Type", "application/json; charset=utf-8")
  return details;
};


fastify.get(
  "/update", // XXX lets just have it at / ? We can always add a path using reverse proxy
  async (request: any, reply: any) => {
    const data = await fetchHashes();

    // TO DO: What to return in try/catch?
    try {
      updateDB(data);
      return "updated"
    } catch (e) {
      return e;
    }
  }
);

fastify.post(
  "/update", // XXX lets just have it at / ? We can always add a path using reverse proxy
  { schema: lookupSchema },
  async (request: any, reply: any) => {
    const data = await fetchHashes();
    console.log(data.length);
    return data;
  }
);

fastify.post(
  "/lookup-trust", // XXX lets just have it at / ? We can always add a path using reverse proxy
  { schema: lookupSchema },
  async (request: any, reply: any) => {
    return emailLookup(request.query.email,reply);
  }
);

fastify.get(
  "/lookup-trust", // XXX lets just have it at / ? We can always add a path using reverse proxy
  async (request: any, reply: any) => {
    return emailLookup(request.query.email,reply);
  }
);


/*
fastify.route({
  handler: async (request: any, reply: any) => {
    return emailLookup(request.query.email);
  },
});
*/

// Run the server!
const start = async () => {
  try {
    await fastify.listen({ port: process.env.PORT || 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

export { start };
