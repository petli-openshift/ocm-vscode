// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import { initService } from './services';
import {
	openocm,
	sendRequest,
	addGateway,
	removeGateway,
	setActiveGateway,
	refreshAll,
	addLogin,
	removeLogin,
	setActiveLogin,
} from './commands';
import { ocmSnippets, readSnippets } from './snippets';
import { RootCodeLensProvider } from './codeLens';
import { initView } from './views';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "ocm-vscode" is now active!');

	initService(context);

	const { ocmResourcesProvider } = initView();

	const selectors = [
		{ language: 'ocm', scheme: 'file' },
		{ language: 'ocm', scheme: 'untitled' },
	];

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	context.subscriptions.push(
		// commands
		vscode.commands.registerCommand('ocm-vscode.newFile', openocm),
		vscode.commands.registerCommand('ocm-vscode.sendRequest', sendRequest),
		vscode.commands.registerCommand('ocm-vscode.addGateway', addGateway),
		vscode.commands.registerCommand('ocm-vscode.removeGateway', removeGateway),
		vscode.commands.registerCommand('ocm-vscode.setActiveGateway', setActiveGateway),
		vscode.commands.registerCommand('ocm-vscode.refreshAll', refreshAll),
		vscode.commands.registerCommand('ocm-vscode.addLogin', addLogin),
		vscode.commands.registerCommand('ocm-vscode.removeLogin', removeLogin),
		vscode.commands.registerCommand('ocm-vscode.setActiveLogin', setActiveLogin),

		// snippets
		vscode.languages.registerCompletionItemProvider(selectors, ocmSnippets),
		vscode.languages.registerCompletionItemProvider(selectors, readSnippets),

		// codeLens
		vscode.languages.registerCodeLensProvider(selectors, new RootCodeLensProvider()),

		// views
		vscode.window.createTreeView('ocmResources', { treeDataProvider: ocmResourcesProvider }),
	);

}

// this method is called when your extension is deactivated
export function deactivate() { }
