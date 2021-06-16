const requiredEnvs = ["PORT", "JWT_KEY"];
const development = process.env.NODE_ENV !== "production";

// if in development, we use the sqlite db so no need to check for database url
if (!development) requiredEnvs.push("DATABASE_URL");

// ensure environment variables exist
requiredEnvs.forEach((envVar) => {
    if (!process.env[envVar]) throw new Error(`Missing env var ${envVar}!`);
});

import fastify, { FastifyInstance } from "fastify";
import home from "./routes/home";
import redirects from "./routes/redirects";
import account from "./routes/account";
import * as Util from "./util";
import { RESPONSES } from "./schemas";
import type { Server, IncomingMessage, ServerResponse } from "http";
import dbEnvironment from "../knexfile.js";
import fastifyStatic from "fastify-static";
import { join } from "path";
import type { APPLICATION_CONTEXT } from "./typings";
import rateLimiter from "fastify-rate-limit";

// create fastify server
const server: FastifyInstance = fastify<Server, IncomingMessage, ServerResponse>();
const database = Util.connectToDB(dbEnvironment[process.env.NODE_ENV ?? "development"]);

// data about the application that gets passed around
const context: APPLICATION_CONTEXT = {
    PORT: Number(process.env.PORT) ?? 4000,
    DATABASE: database,
    ALLOWED_IP: process.env.ALLOWED_IP,
    JWT_KEY: process.env.JWT_KEY,
};

// register the ratelimiter plugin
server.register(rateLimiter, {
    max: 10,
    timeWindow: "1 minute",
});

// register the static file server plugin
server.register(fastifyStatic, {
    root: join(__dirname, "..", "public/"),
});

// routes
const homeRouter = home(context);
const redirectsRouter = redirects(context);
const accountRouter = account(context);

// register api routes, by registering I can add the /api/v1 prefix to all these routes
server.register(
    (apiRoutes, _opts, done) => {
        // home message
        apiRoutes.get("/", RESPONSES.HOME, homeRouter.get);
        // create a redirect
        apiRoutes.post("/redirects", RESPONSES.REDIRECT_CREATE, redirectsRouter.post);
        // delete a redirect
        apiRoutes.delete("/s/:nanoId", RESPONSES.REDIRECT_DELETE, redirectsRouter.del);
        apiRoutes.register(
            (accountRoutes, __opts, done) => {
                // create an account
                accountRoutes.post("/", RESPONSES.ACCOUNT_CREATE, accountRouter.post);
                // login to an account
                accountRoutes.post("/login", RESPONSES.ACCOUNT_LOGIN, accountRouter.login_post);
                done();
            },
            { prefix: "accounts" },
        );
        done();
    },
    { prefix: "api/v1" },
);

// go to a redirect
server.get("/s/:nanoId", redirectsRouter.get);
// home page
server.get("/", async (_, res) => {
    return res.sendFile("index.html");
});

//start server
server.listen(context.PORT, "0.0.0.0", (e) => {
    if (e) throw e;
    return console.log("Server started!");
});
