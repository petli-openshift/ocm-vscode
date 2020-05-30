import { CodeLensProvider, CodeLens, TextDocument, CancellationToken } from 'vscode';
import { sendRequest } from './send_request';


export class RootCodeLensProvider implements CodeLensProvider {
    public provideCodeLenses(document: TextDocument, token: CancellationToken): CodeLens[] | Promise<CodeLens[]> {
        let codeLenses: CodeLens[] = [];
        codeLenses = codeLenses.concat(sendRequest(document));

        return codeLenses;
    }

    public resolveCodeLens?(codeLens: CodeLens, token: CancellationToken): CodeLens | Promise<CodeLens> {
        return codeLens;
    }
}
