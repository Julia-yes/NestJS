"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const serverless_express_1 = require("@vendia/serverless-express");
const main_1 = require("./main");
let server;
async function bootstrap() {
    if (!server) {
        const app = await (0, main_1.createApp)();
        await app.init();
        const expressApp = app.getHttpAdapter().getInstance();
        server = (0, serverless_express_1.default)({ app: expressApp });
    }
    return server;
}
const handler = async (event, context) => {
    const server = await bootstrap();
    return server(event, context);
};
exports.handler = handler;
//# sourceMappingURL=lambda.js.map