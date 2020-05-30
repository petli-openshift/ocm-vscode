import * as vscode from 'vscode';
import { config, replaceConfig } from '../services';
import { OcmResource, refreshGateway } from '../views';

export function removeGateway(gatewayItem?: OcmResource) {
    if (gatewayItem) {
        const gatewayUrl = gatewayItem.name;
        if (gatewayUrl in config.gateways) {
            delete config.gateways[gatewayUrl];
            replaceConfig(config);
            refreshGateway();
        } else {
            vscode.window.showErrorMessage(gatewayUrl + ' does not exists!');
        }
    } else {
        vscode.window.showErrorMessage('This command cannot be called outside the tree view');
    }
}
