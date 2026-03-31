const {
    createConnection,
    TextDocuments,
    ProposedFeatures,
    TextDocumentSyncKind,
    CodeActionKind
} = require('vscode-languageserver/node');
const { TextDocument } = require('vscode-languageserver-textdocument');

const connection = createConnection(ProposedFeatures.all);
const documents = new TextDocuments(TextDocument);

let additionalSeparators = [];

connection.onInitialize((params) => {
    let opts = params.initializationOptions || {};
    if (opts.additional_separators && Array.isArray(opts.additional_separators)) {
        additionalSeparators = opts.additional_separators;
    }
    
    return {
        capabilities: {
            textDocumentSync: TextDocumentSyncKind.Full,
            codeActionProvider: true
        }
    };
});

connection.onCodeAction((params) => {
    const document = documents.get(params.textDocument.uri);
    if (!document) return null;

    const range = params.range;
    if (range.start.line === range.end.line) return null;

    const text = document.getText();
    const lines = text.split(/\r?\n/);
    
    const startLine = range.start.line;
    const endLine = range.end.line;
    
    if (startLine >= lines.length || endLine >= lines.length) return null;
    
    const selectedLines = lines.slice(startLine, endLine + 1);
    const baseAlignChars = ["=>", "=", ":"];
    const alignChars = [...new Set([...additionalSeparators, ...baseAlignChars])];
    
    let maxPosition = 0;
    let alignChar = '';
    
    for (let line of selectedLines) {
        for (let char of alignChars) {
            let pos = line.indexOf(char);
            if (pos !== -1) {
                let prefixLen = line.slice(0, pos).replace(/\s+$/g, '').length;
                if (prefixLen > maxPosition) {
                    maxPosition = prefixLen;
                    alignChar = char;
                }
                break;
            }
        }
    }

    if (!alignChar) return null;

    const resultLines = selectedLines.map(line => {
        let pos = line.indexOf(alignChar);
        if (pos !== -1) {
            let leftPart = line.slice(0, pos).replace(/\s+$/g, '');
            let rightPart = line.slice(pos + alignChar.length).replace(/^\s+/g, '');
            let padLen = Math.max(0, maxPosition - leftPart.length);
            let padding = ' '.repeat(padLen);
            return leftPart + padding + ' ' + alignChar + ' ' + rightPart;
        }
        return line;
    });

    const newText = resultLines.join('\n') + '\n';
    
    return [
        {
            title: "Align Chars",
            kind: CodeActionKind.Refactor,
            edit: {
                changes: {
                    [document.uri]: [
                        {
                            range: {
                                start: { line: startLine, character: 0 },
                                end: { line: endLine + 1, character: 0 }
                            },
                            newText: newText
                        }
                    ]
                }
            }
        }
    ];
});

documents.listen(connection);
connection.listen();
