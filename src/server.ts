import Fastify from "fastify";
import dotenv from "dotenv";
//import lookupRoutes from "./lookup.js";

dotenv.config();

const fastify = Fastify({
  logger: true,
});

const start = async () => {
  try {
    // register routes
    // fastify.register(lookupRoutes);

    // start server
    const port = Number(process.env.PORT) || 3000;
    await fastify.listen({ port, host: "0.0.0.0" });

    console.log(`Server running on port ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
