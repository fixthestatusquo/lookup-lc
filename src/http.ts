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



fastify.post(
  "/update", // XXX lets just have it at / ? We can always add a path using reverse proxy
  async (request: any, reply: any) => {
    try {
      const status = await updateDB();
      return {isError:false, total: status.total};
    } catch (e) {
console.log(e);
      return {isError:true, error:e.toString()};
    }
  }
);

fastify.post('/trust/lookup', async (request, reply) => {

  try {
    const email = request.query.email;
    const result = await remoteLookup(email);
console.log(email, result);
    let r = {found:result};
    if (result) {
      r.action= {customFields: {isSubscribed: true}};
    }
    return r;
  } catch (error) {
console.log(error);
    reply.code(500).send({ error: error.toString() });
  }
});

fastify.post('/lookup', async (request, reply) => {

  try {
    const email = request.query.email;
    const isSubscribed = await lookup(email);
    let r = {found:isSubscribed};
    if (isSubscribed) {
      r.action= {customFields: {isSubscribed: true}};
    }
    return r;
  } catch (error) {
console.log(error);
    reply.code(500).send({ isError:true,error: error.toString(),found:false });
  }
});

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
