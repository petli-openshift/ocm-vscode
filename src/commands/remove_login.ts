import * as vscode from 'vscode';
import { config, replaceConfig } from '../services';
import { OcmResource, refreshLogin } from '../views';

export function removeLogin(loginItem?: OcmResource) {
    if (loginItem) {
        const token = loginItem.name;
        if (token in config.logins) {
            delete config.logins[token];
            replaceConfig(config);
            refreshLogin();
        } else {
            vscode.window.showErrorMessage(loginItem.label + ' does not exists!');
        }
    } else {
        vscode.window.showErrorMessage('This command cannot be called outside the login panel.');
    }
}
