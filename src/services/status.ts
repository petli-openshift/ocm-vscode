import * as vscode from 'vscode';
import { ocm } from './ocm';
import { config } from './index';

export interface STATUS {
    isOcmInstalled: boolean;
    activeGateway: string;
    activeLogin: string;
    activeUser: string;
}

export function initStatus(): Promise<STATUS> {
    return new Promise<STATUS>((resolve) => {
        const status: STATUS = {
            isOcmInstalled: false,
            activeGateway: '',
            activeLogin: '',
            activeUser: '',
        };

        const gatewayRequest = ocm('ocm config get url');
        const tokenRequest = ocm('ocm config get refresh_token');
        const userRequest = ocm('ocm whoami');

        gatewayRequest.then((gatewayResult) => {
            if (typeof gatewayResult === 'string' && gatewayResult.startsWith('http')) {
                status.isOcmInstalled = true;
                status.activeGateway = gatewayResult.trim();
                return Promise.all([tokenRequest, userRequest]);
            }
            throw new Error('error running ocm command');
        }).then((results) => {
            const [tokenResult, userResult] = results;
            const username = (userResult as any).username;
            if (!username) {
                throw new Error('error getting the current logged in user');
            }
            status.activeUser = username;
            status.activeLogin = '';
            for (const t in config.logins) {
                if (config.logins[t] === username) {
                    status.activeLogin = t;
                    break;
                }
            }
            // the user did not log in through this. use the refresh token instead.
            if (!status.activeLogin && tokenResult && typeof tokenResult === 'string') {
                status.activeLogin = tokenResult.trim();
            }
            resolve(status);
        }).catch((reason) => {
            vscode.window.showErrorMessage(reason);
            resolve(status);
        });
    });
}