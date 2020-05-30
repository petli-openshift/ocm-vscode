import * as vscode from 'vscode';
import { ocm } from '../services';

const requestBodyRegex = new RegExp(/<<\s*(\w+)$/);

export function sendRequest(startLine: number) {
    if (startLine >= 0 && vscode.window.activeTextEditor) {
        const document = vscode.window.activeTextEditor.document;
        let endLine = startLine + 1;
        const line = document.lineAt(startLine);
        const text = line.text.trim();
        let cmdText = text;
        const match = requestBodyRegex.exec(text);
        if (match) { //mutli-line body
            const marker = match[1];
            const endRegex = new RegExp(`\\b${marker}\\b`);
            for (; endLine < document.lineCount; endLine++) {
                const ll = document.lineAt(endLine);
                const tt = ll.text.trim();
                if (endRegex.test(tt)) {
                    break;
                }
            }
            // found
            if (endLine < document.lineCount) {
                const endl = document.lineAt(endLine);
                const range = new vscode.Range(line.range.start, endl.range.end);
                cmdText = vscode.window.activeTextEditor.document.getText(range);
                endLine++;
            } else {
                endLine = startLine + 1;
            }
        } else if (text.endsWith('\\')) { //multi-line command
            const lines = [text.substring(0, text.length - 1).trim()];
            for (; endLine < document.lineCount; endLine++) {
                const ll = document.lineAt(endLine);
                const tt = ll.text.trim();
                if (tt.endsWith('\\')) {
                    lines.push(tt.substring(0, tt.length - 1).trim());
                } else {
                    lines.push(tt.trim());
                    endLine++;
                    break;
                }
            }
            cmdText = lines.join(' ');
        }

        // append API response to the request.
        ocm(cmdText).then((response) => {
            if (vscode.window.activeTextEditor) {
                vscode.window.activeTextEditor.edit((editBuilder: vscode.TextEditorEdit) => {
                    if (vscode.window.activeTextEditor) {
                        let resultText = response;
                        if (typeof response !== 'string') {
                            resultText = JSON.stringify(response, null, 2);
                        }

                        if (endLine >= document.lineCount) {
                            const insertLine = vscode.window.activeTextEditor.document.lineAt(document.lineCount - 1);
                            editBuilder.insert(insertLine.range.end, "\n" + resultText);
                        } else {
                            const insertLine = vscode.window.activeTextEditor.document.lineAt(endLine);
                            editBuilder.insert(insertLine.range.start, resultText + "\n");
                        }
                    }
                });
            }
        }, (err) => {
            vscode.window.showInformationMessage(err);
        });
    }
}
