"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vscode = require("vscode");
// this method is called when vs code is activated
function activate(context) {
    // create a decorator type that we use to decorate small numbers
    var nullDecoration = vscode.window.createTextEditorDecorationType({});
    var activeEditor = vscode.window.activeTextEditor;
    if (activeEditor) {
        updateDecorations();
    }
    vscode.window.onDidChangeActiveTextEditor(function (editor) {
        activeEditor = editor;
        if (editor) {
            updateDecorations();
        }
    }, null, context.subscriptions);
    vscode.workspace.onDidChangeTextDocument(function () {
        updateDecorations();
    }, null, context.subscriptions);
    function updateDecorations() {
        if (!activeEditor) {
            return;
        }
        var configuration = vscode.workspace.getConfiguration('code-eol');
        var decorationColor = configuration.color;
        var regEx = /(\r(?!\n))|(\r?\n)/g;
        var text = activeEditor.document.getText();
        var newLines = [];
        var match;
        while ((match = regEx.exec(text))) {
            var decTxt = getDecTxt(match[0]);
            var startPos = activeEditor.document.positionAt(match.index);
            var endPos = activeEditor.document.positionAt(match.index);
            var decoration = {
                range: new vscode.Range(startPos, endPos),
                renderOptions: {
                    after: {
                        contentText: decTxt,
                        color: decorationColor
                    }
                }
            };
            newLines.push(decoration);
        }
        activeEditor.setDecorations(nullDecoration, newLines);
    }
}
exports.activate = activate;
function getDecTxt(match) {
    switch (match) {
        case '\n':
            return '↓';
        case '\r\n':
            return '↵';
        case '\r':
            return '←';
        default:
            return '';
    }
}
//# sourceMappingURL=extension.js.map