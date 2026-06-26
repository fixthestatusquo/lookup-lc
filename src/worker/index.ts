import schedule from "node-schedule";
import { sync } from "./sync";

const CRON = process.env.WORKER_CRON ?? "0 10 * * *";

export const startWorker = () => {
  sync().catch(console.error);
  schedule.scheduleJob(CRON, () => sync().catch(console.error));
  console.log(`Worker scheduled: ${CRON}`);
};
