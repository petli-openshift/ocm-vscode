import * as vscode from 'vscode';
import { ocm, status } from '../services';
import { OcmResource, refreshGateway } from '../views';

export function setActiveGateway(gatewayItem?: OcmResource) {
    if (gatewayItem) {
        const gatewayUrl = gatewayItem.name;
        ocm(`ocm config set url ${gatewayUrl}`).then((res) => {
            status.then((s) => {
                s.activeGateway = gatewayUrl;
                return Promise.resolve(s);
            });
            refreshGateway();
        }, (err) => {
            vscode.window.showErrorMessage(err);
        });
    } else {
        vscode.window.showErrorMessage('This command cannot be called directly');
    }
}
