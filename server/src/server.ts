import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import * as UserAgent from "express-useragent";
import path from "path";
import { application } from "../config/config";
import { initModels } from "../models/init-models";
import { adminRouterApp } from "./API/admin/routers/init-router";
import { clientAppRouter } from "./API/client/routers/clientApp.router";
import { routerApp } from "./API/client/routers/init-router";
import fileUpload from "express-fileupload";

import { CronJob } from "./cron-job";
import { ErrorMiddleware } from "./middlewares/error-middleware";
import { SequelizeConnect } from "./services/database-connect";

export const app = express();

export const run = async () => {
    initModels(SequelizeConnect);

    await CronJob.startJob();

    app
        .use(UserAgent.express())
        .use(cors())
        .use(bodyParser.json())
        .use(express.json())
        .use(cookieParser())
        .use(fileUpload())
        .use("/api", routerApp)
        .use("/api/admin", adminRouterApp)
        .use(express.static(path.join(__dirname, "files")))
        .use(express.static(path.join(__dirname, "public")))
        .use(express.static(path.join(__dirname, "public/app")))
        // .use('/', clientAppRouter)
        .use(ErrorMiddleware)
        .listen(application.port, () => {
            console.log(`Server listening on port = ${application.port}`);
        });
};
