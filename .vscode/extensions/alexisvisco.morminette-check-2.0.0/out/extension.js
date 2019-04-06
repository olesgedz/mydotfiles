"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vscode = require("vscode");
var child_process_1 = require("child_process");
function activate(context) {
    var errorsDecoration = vscode.window.createTextEditorDecorationType({
        overviewRulerColor: 'red',
        overviewRulerLane: vscode.OverviewRulerLane.Right,
        backgroundColor: 'rgba(255,0,0,0.2)',
    });
    var activeEditor = vscode.window.activeTextEditor;
    if (activeEditor) {
        triggerUpdateDecorations();
    }
    vscode.window.onDidChangeActiveTextEditor(function (editor) {
        activeEditor = editor;
        if (editor) {
            triggerUpdateDecorations();
        }
    }, null, context.subscriptions);
    vscode.workspace.onDidChangeTextDocument(function (event) {
        if (activeEditor && event.document === activeEditor.document) {
            triggerUpdateDecorations();
        }
    }, null, context.subscriptions);
    var timeout = undefined;
    function triggerUpdateDecorations() {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(updateDecorations, 500);
    }
    function updateDecorations() {
        if (!activeEditor && activeEditor.document.languageId !== "c") {
            return;
        }
        var errors = [];
        runNorminetteProccess(activeEditor.document.uri.path)
            .then(function (data) {
            data.forEach(function (e) {
                var range;
                var decoration;
                if (!e.col || !activeEditor.document.getWordRangeAtPosition(new vscode.Position(e.line, e.col))) {
                    range = activeEditor.document.lineAt(e.line).range;
                    decoration = { range: range, hoverMessage: 'Error: **' + e.errorText + '**' };
                }
                else {
                    range = activeEditor.document.getWordRangeAtPosition(new vscode.Position(e.line, e.col));
                    decoration = { range: range, hoverMessage: 'Error: **' + e.errorText + '**' };
                }
                errors.push(decoration);
            });
            activeEditor.setDecorations(errorsDecoration, errors);
        });
    }
    function runNorminetteProccess(filename) {
        console.log(filename);
        return new Promise(function (resolve, reject) {
            var line = [];
            var normDecrypted = [];
            var proc = child_process_1.exec('norminette ' + filename, function (error, stdout, stderr) {
                stdout.split('\n').forEach(function (e, i) {
                    if (i == 0)
                        return;
                    line.push(e);
                });
            });
            proc.on('close', function (exitCode) {
                try {
                    line.pop();
                    line.forEach(function (e) {
                        normDecrypted.push(normDecrypt(e));
                    });
                    console.log(normDecrypted);
                    resolve(normDecrypted);
                }
                catch (e) {
                    console.log(e);
                }
            });
        });
    }
    function normDecrypt(normLine) {
        var line, col;
        var array = normLine.split(":")[0].match(/[0-9]+/g);
        if (array)
            _a = array.map(function (e) { return +e; }), line = _a[0], col = _a[1];
        var ob = {
            line: line < 0 ? 0 : line - 1 || 0,
            col: col,
            fullText: normLine,
            errorText: normLine.split(":")[1]
        };
        return ob;
        var _a;
    }
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map