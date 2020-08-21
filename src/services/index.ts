import * as vscode from 'vscode';
import { ocm } from './ocm';
import { STATUS, initStatus } from './status';
import { CONFIG, initConfig, replaceConfig, getConfig } from './config';

let status: Promise<STATUS>;
let config: CONFIG;

function initService(context: vscode.ExtensionContext) {
    config = initConfig(context);
    refreshStatus();
}

function refreshConfig() {
    config = getConfig();
}

function refreshStatus() {
    status = initStatus();
    status.then((s) => {
        if (s.isOcmInstalled) {
            let configChanged = false;
            if (s.activeGateway && !(s.activeGateway in config.gateways)) {
                config.gateways[s.activeGateway] = true;
                configChanged = true;
            }
            if (s.activeLogin && (!(s.activeLogin in config.logins) || config.logins[s.activeLogin] !== s.activeUser)) {
                config.logins[s.activeLogin] = s.activeUser;
                configChanged = true;
            }
            if (configChanged) {
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
    initService,
    refreshConfig,
    refreshStatus
};
