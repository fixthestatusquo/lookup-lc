import { init, captureException } from "@sentry/node";

const isProd = process.env.NODE_ENV === "production";

if (process.env.NODE_ENV === "production" && process.env.SENTRY_DSN) {
  init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
  });
}

export const captureError = (err: unknown, extra?: any) => {
  if (isProd) {
    captureException(err, { extra });
  }
};
