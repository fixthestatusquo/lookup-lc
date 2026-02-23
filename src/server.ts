import Fastify from "fastify";
import dotenv from "dotenv";
import httpRoutes from "./http";

dotenv.config();

const fastify = Fastify({
  logger:
    process.env.NODE_ENV === "development"
      ? {
          level: "debug",
          transport: {
            target: "pino-pretty",
            options: {
              colorize: true,
              translateTime: "SYS:standard",
            },
          },
        }
      : true, // default logger in production
});

const start = async () => {
  try {
    // register routes
    fastify.register(httpRoutes);

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
