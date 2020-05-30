import * as vscode from 'vscode';


export function openocm() {
    vscode.workspace.openTextDocument({ language: 'ocm', content: '' }).then(doc => {
        vscode.window.showTextDocument(doc, vscode.ViewColumn.Active).then(editor => {
            // TODO: opened
        });

    });
}
