import * as vscode from 'vscode';
import { config, replaceConfig, status } from '../services';
import { refreshAll } from './refresh_all';
import { ocm } from '../services/ocm';

export function addLogin() {
    vscode.window.showInputBox({ placeHolder: 'offline token' }).then((value) => {
        if (value && value.trim()) {
            const token = value.trim();
            if (!(token in config.logins)) {
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
                    let dupToken = '';
                    for (const t in config.logins) {
                        if (config.logins[t] === username) {
                            dupToken = t;
                            break;
                        }
                    }
                    if (dupToken !== '') {
                        vscode.window.showWarningMessage('There is already a token associated with this user.', 'overwrite', 'cancel').then((answer) => {
                            if (answer === 'overwrite') {
                                delete config.logins[dupToken];
                                config.logins[token] = username;
                                replaceConfig(config);
                                refreshAll();
                            }
                        });
                    } else {
                        config.logins[token] = username;
                        replaceConfig(config);
                        refreshAll();
                    }
                }).catch((reason) => {
                    vscode.window.showErrorMessage(reason);
                });
            } else {
                vscode.window.showErrorMessage('token already exists!');
            }
        }
    });
}
