import * as vscode from 'vscode';
import { ocm, status, config, replaceConfig } from '../services';
import { OcmResource } from '../views';
import { refreshAll } from './refresh_all';


export function setActiveLogin(loginItem?: OcmResource) {
    if (loginItem) {
        const token = loginItem.name;
        let loginCmd = `ocm login --token="${token}"`;
        status.then((s) => {
            if (s.activeGateway) {
                loginCmd += ` --url="${s.activeGateway}"`;
            }
            return ocm(loginCmd);
        }).then((result) => {
            if (typeof result === 'string' && (result.includes('Error') || result.includes('400'))) {
                throw new Error(result);
            }
            return ocm('ocm whoami');
        }).then((result) => {
            const username = (result as any).username;
            if (!username) {
                throw new Error('error getting user for the token.');
            }
            if (config.logins[token] !== username) {
                config.logins[token] = username;
                replaceConfig(config);
            }
            refreshAll();
        }).catch((reason) => {
            vscode.window.showErrorMessage(reason);
        });
    } else {
        vscode.window.showErrorMessage('This command cannot be called outside login panel.');
    }
}
