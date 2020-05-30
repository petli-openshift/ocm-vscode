import { CodeLens, TextDocument, Range } from 'vscode';


const requestRegex = new RegExp(/\bocm\s+.*/g);

export function sendRequest(document: TextDocument): CodeLens[] {
    const text = document.getText().trim();
    const codeLenses: CodeLens[] = [];
    let match: RegExpExecArray | null;
    // match request lines
    while (match = requestRegex.exec(text)) {
        const start = match['index'];
        const end = start + match[0].length;
        const startPos = document.positionAt(start);
        const endPos = document.positionAt(end);
        const range = new Range(startPos, endPos);
        const codeLens = new CodeLens(range, {
            title: 'Send Request',
            tooltip: 'execute ocm command',
            command: 'ocm-vscode.sendRequest',
            arguments: [startPos.line]
        });
        codeLenses.push(codeLens);
    }

    return codeLenses;
}
