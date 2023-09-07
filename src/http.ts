import Fastify from 'fastify'
import { lookup as remoteLookup, updateDB } from './update';
import lookup from './lookup';
import dotenv from 'dotenv';
import { subscribe } from 'diagnostics_channel';

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



fastify.get(
  "/update", // XXX lets just have it at / ? We can always add a path using reverse proxy
  async (request: any, reply: any) => {
    // TO DO: What to return?
    try {
      const status = await updateDB(data);
      return {isError:false, total: status.total};
    } catch (e) {
console.log(e);
      return {isError:true, error:e.toString()};
    }
  }
);

fastify.post(
  "/update", // XXX lets just have it at / ? We can always add a path using reverse proxy
  async (request: any, reply: any) => {
    try {
      const status = await updateDB(data);
      return {isError:false, total: status.total};
    } catch (e) {
console.log(e);
      return {isError:true, error:e.toString()};
    }
  }
);

fastify.get('/trust/lookup', async (request, reply) => {

  try {
    const email = request.query.email;
    const result = await remoteLookup(email);
console.log(result);
    if (isSubscribed) {
      reply.code(200).send({ message: 'Email exists in the trust system', email });
    } else {
      reply.code(200).send({ message: 'Email not found in the trust system', email });
    }
  } catch (error) {
    reply.code(500).send({ error: 'Internal Server Error' });
  }
});

fastify.get('/lookup', async (request, reply) => {

  try {
    const email = request.query.email;
    const isSubscribed = await lookup(email);

    if (isSubscribed) {
      reply.code(200).send({ message: 'Email exists in the trust system', email });
    } else {
      reply.code(200).send({ message: 'Email not found in the trust system', email });
    }
  } catch (error) {
    reply.code(500).send({ error: 'Internal Server Error' });
  }
});

// fastify.post(
//   "/trust-lookup", // XXX lets just have it at / ? We can always add a path using reverse proxy
//   { schema: lookupSchema },
//   async (request: any, reply: any) => {
//     console.log("Here", request)
//     return emailLookup(request.query.email,reply);
//   }
// );

// fastify.get(
//   "/lookup-trust", // XXX lets just have it at / ? We can always add a path using reverse proxy
//   async (request: any, reply: any) => {
//     console.log(1, request, reply);
//     return emailLookup(request.query.email,reply);
//   }
// );


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
    console.log("Server up");
  } catch (err) {
    fastify.log.error("Server down:", err);
    process.exit(1);
  }
};

export { start };
