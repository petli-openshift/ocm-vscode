import * as vscode from 'vscode';
import { config, replaceConfig } from '../services';
import { refreshGateway } from '../views';

export function addGateway() {
    vscode.window.showInputBox({ placeHolder: 'https://gateway-url' }).then((value) => {
        if (value && value.trim()) {
            const gatewayUrl = value.trim();
            if (!(gatewayUrl in config.gateways)) {
                config.gateways[gatewayUrl] = true;
                replaceConfig(config);
                refreshGateway();
            } else {
                vscode.window.showErrorMessage(gatewayUrl + ' already exists!');
            }
        }
    });
}
