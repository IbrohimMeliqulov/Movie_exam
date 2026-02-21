import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { appendFile } from "fs/promises";
import { join } from "path"




@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    async use(req: Request, res: Response, next: NextFunction) {

        await appendFile(join(process.cwd(), "src", "log", "logger.txt"), req.baseUrl + " " + req.method + " " + req.headers["user-agent"] + '\n')
        next()
    }
}