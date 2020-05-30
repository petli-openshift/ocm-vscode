import * as vscode from 'vscode';
import { ocm } from './ocm';

export interface STATUS {
    isOcmInstalled: boolean;
    activeGateway: string;
}

export function initStatus(context: vscode.ExtensionContext): Promise<STATUS> {
    return new Promise<STATUS>((resolve) => {
        const config: STATUS = {
            isOcmInstalled: false,
            activeGateway: '',
        };

        ocm('ocm config get url').then((response) => {
            if (typeof response === 'string' && response.startsWith('http')) {
                config.isOcmInstalled = true;
                config.activeGateway = response.trim();
            }
            resolve(config);
        }, (err) => {
            resolve(config);
        });
    });
}