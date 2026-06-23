import Fastify from "fastify";
import "./sentry";
import dotenv from "dotenv";
import minimist from "minimist";
import httpRoutes from "./http";

const argv = minimist(process.argv.slice(2));
const clientFlag = Object.keys(argv).find(k => k !== '_' && argv[k] === true);
const envFile = argv.env || (clientFlag ? `.env.${clientFlag}` : ".env");
dotenv.config({ path: envFile });

const port = Number(process.env.PORT);
if (!port) throw new Error("PORT environment variable is required");

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
      : true,
});

const start = async () => {
  try {
    fastify.register(httpRoutes);
    await fastify.listen({ port, host: "0.0.0.0" });
    if (process.env.TYPE === "local") {
      const { startWorker } = await import("./worker/index");
      startWorker();
    }
    console.log(`Server running on port ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
