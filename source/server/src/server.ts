import { app } from "./index";
import * as Constants from './constants';

app.listen({
  port: process.env.API_PORT || Constants.API_PORT,
  idleTimeout: 0
});

console.log(
  `🦊 ${process.env.API_NAME} API Server is running at ${app.server?.hostname}:${app.server?.port}`
);

export type App = typeof app