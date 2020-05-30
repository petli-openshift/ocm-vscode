import * as vscode from 'vscode';
import * as ocmSnippetData from './ocm_snippets.json';


export const ocmSnippets = {

    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
        const completions: vscode.CompletionItem[] = [];

        for (let label in ocmSnippetData) {
            const data = (ocmSnippetData as any)[label];
            const completion = new vscode.CompletionItem(label, vscode.CompletionItemKind.Function);
            completion.insertText = new vscode.SnippetString(data.body.join("\n"));
            completion.documentation = new vscode.MarkdownString(data.description);

            completions.push(completion);
        }


        // return all completion items as array
        return completions;
    }
};