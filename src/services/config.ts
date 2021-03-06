import * as vscode from 'vscode';


const CONFIG_KEY = 'ocm.config';

export interface CONFIG {
    gateways: {
        [key: string]: boolean;
    },
    logins: {
        [key: string]: string;
    }
};

let _context: vscode.ExtensionContext;

export function initConfig(context: vscode.ExtensionContext): CONFIG {
    _context = context;
    const emptyCfg = { gateways: {}, logins: {} };
    const cfg = <any>context.globalState.get(CONFIG_KEY) || emptyCfg;
    return {...emptyCfg, ...cfg};
}

export function replaceConfig(cfg: CONFIG) {
    if (!_context) {
        return;
    }
    _context.globalState.update(CONFIG_KEY, cfg);
}

export function getConfig(): CONFIG {
    const emptyCfg = { gateways: {}, logins: {} };
    if (!_context) {
        return emptyCfg;
    }
    const cfg = <any>_context.globalState.get(CONFIG_KEY) || emptyCfg;
    return {...emptyCfg, ...cfg};
}