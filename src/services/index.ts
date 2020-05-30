import * as vscode from 'vscode';
import { ocm } from './ocm';
import { STATUS, initStatus } from './status';
import { CONFIG, initConfig, replaceConfig } from './config';

let status: Promise<STATUS>;
let config: CONFIG;

function initService(context: vscode.ExtensionContext) {
    config = initConfig(context);
    status = initStatus(context);
    status.then((s) => {
        if (s.isOcmInstalled && s.activeGateway) {
            if (!(s.activeGateway in config.gateways)) {
                config.gateways[s.activeGateway] = true;
                replaceConfig(config);
            }
        }
    });
}

export {
    ocm,
    status,
    config,
    replaceConfig,
    initService
};
