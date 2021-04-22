import * as vscode from 'vscode';
import { config, status } from '../services';

export class OcmResourcesProvider implements vscode.TreeDataProvider<OcmResource> {
    private gatewayRoot: OcmResource | undefined;
    private loginRoot: OcmResource | undefined;

    constructor(private workspaceRoot: string) { }

    getTreeItem(item: OcmResource): vscode.TreeItem {
        return item;
    }

    async getChildren(item?: OcmResource): Promise<OcmResource[]> {
        const children: OcmResource[] = [];

        const sts = await status;
        if (!item) {
            if (sts.isOcmInstalled) {
                if (!this.gatewayRoot) {
                    this.gatewayRoot = new OcmResource(vscode.TreeItemCollapsibleState.Expanded, 'gateway', 'gateway', 'gateway');
                }
                children.push(this.gatewayRoot);
                if (!this.loginRoot) {
                    this.loginRoot = new OcmResource(vscode.TreeItemCollapsibleState.Expanded, 'login', 'login', 'login');
                }
                children.push(this.loginRoot);
            }
        } else if (item.contextValue === 'gateway') {
            for (let gw of Object.keys(config.gateways)) {
                const label = sts.activeGateway === gw ? '* ' + gw : gw;
                const gatewayItem = new OcmResource(vscode.TreeItemCollapsibleState.None, gw, label, 'gatewayItem');
                gatewayItem.command = { title: 'Set active gateway', command: 'ocm-vscode.setActiveGateway', arguments: [gatewayItem] };
                children.push(gatewayItem);
            }
        } else if (item.contextValue === 'login') {
            for (let lg of Object.keys(config.logins)) {
                const label = sts.activeLogin === lg ? '* ' + config.logins[lg] : config.logins[lg];
                const loginItem = new OcmResource(vscode.TreeItemCollapsibleState.None, lg, label, 'loginItem');
                loginItem.command = { title: 'Change login user', command: 'ocm-vscode.setActiveLogin', arguments: [loginItem] };
                children.push(loginItem);
            }
        }

        return Promise.resolve(children);
    }

    private _onDidChangeTreeData = new vscode.EventEmitter<OcmResource | undefined>();
    onDidChangeTreeData = this._onDidChangeTreeData.event;

    refreshGateway() {
        this._onDidChangeTreeData.fire(this.gatewayRoot);
    }

    refreshLogin() {
        this._onDidChangeTreeData.fire(this.loginRoot);
    }
}


export class OcmResource extends vscode.TreeItem {
    constructor(
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public name: string,
        label: string,
        contextValue?: string
    ) {
        super(label, collapsibleState);
        this.contextValue = contextValue || 'ocmResource';
    }

    // @ts-ignore
    get tooltip(): string {
        return this.label || this.name;
    }

    // @ts-ignore
    get description(): string {
        let desc = '';
        switch (this.name) {
            case 'gateway':
                desc = 'click to switch API gateway';
                break;
            case 'login':
                desc = 'click to switch login user';
                break;
        }
        return desc;
    }
}