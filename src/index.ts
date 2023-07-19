import yargs from "yargs";
import { logger } from "./logger";
import { hideBin } from "yargs/helpers";
import { Application } from "~/base/Application";

const main = async () => {
    const argv = await yargs(hideBin(process.argv)).argv;
    const app = new Application(argv);
    await app.run();
};

main().catch(ex => {
    logger.error(ex.message);
});
