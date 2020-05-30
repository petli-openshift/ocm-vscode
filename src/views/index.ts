import * as vscode from 'vscode';
import { OcmResourcesProvider, OcmResource } from './ocm_resource';


let _ocmResourcesProvider: OcmResourcesProvider;

function initView(): { ocmResourcesProvider: OcmResourcesProvider } {
    const rootPath = (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) ?
        vscode.workspace.workspaceFolders[0].uri.fsPath : '';
    const ocmResourcesProvider = new OcmResourcesProvider(rootPath);
    _ocmResourcesProvider = ocmResourcesProvider;
    return { ocmResourcesProvider };
}

function refreshGateway() {
    if (_ocmResourcesProvider) {
        _ocmResourcesProvider.refreshGateway();
    }
}

export {
    initView,
    refreshGateway,
    OcmResource
};
