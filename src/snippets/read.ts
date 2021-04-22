import * as vscode from 'vscode';
import * as readSnippetData from './read_snippets.json';


export const readSnippets = {

    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
        const completions: vscode.CompletionItem[] = [];

        for (let endpoint in readSnippetData) {
            const data = (readSnippetData as any)[endpoint];
            for (let service of data["services"]) {
                const completion = new vscode.CompletionItem(endpoint, vscode.CompletionItemKind.Enum);
                let i = 1;
                const ep = endpoint.replace(/{([^}]+)}/g, (_, m) => `\${${i++}:${m}}`);
                let params = '';
                if (data.parameters) {
                    params = ' --parameter ' + data.parameters.join(' --parameter ');
                }
                completion.insertText = new vscode.SnippetString(`ocm get ${service}${ep}${params}`);
                completion.documentation = new vscode.MarkdownString(data.description);
                completions.push(completion);
            }
        }

        // return all completion items as array
        return completions;
    }
};