/**
 * node index.js \
 * --username davidferreira \
 * --room sala01 \
 * --hostUri localhost
 */

import Events from 'events';
import CliConfig from './cli-config.js';
import TerminalController from "./terminal-controller.js";

const componentEmitter = new Events()

const cmd = CliConfig.parseArguments(process.argv)
console.log('CLI CONFIG', cmd)

const controller = new TerminalController()
await controller.initializeTable(componentEmitter)