/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("vscode");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deactivate = exports.activate = void 0;
const vscode = __webpack_require__(1);
function activate(context) {
    let activeEditor = vscode.window.activeTextEditor;
    let isEnabled = true;
    // Create and show a status bar item
    const toggleStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    toggleStatusBarItem.command = "togglePHPBackground";
    toggleStatusBarItem.tooltip = "Toggle PHP Background Color";
    toggleStatusBarItem.text = isEnabled ? "[🎨 ON]" : "[🎨 OFF]";
    toggleStatusBarItem.show();
    context.subscriptions.push(toggleStatusBarItem);
    // Get the configuration for the background color
    let config = vscode.workspace.getConfiguration("phpCodeblockHighlighter");
    let backgroundColor = config.get("backgroundColor", "rgba(50, 120, 200, 0.5)");
    // Create a text editor decoration type for the PHP code blocks
    let phpDecorationType = vscode.window.createTextEditorDecorationType({
        backgroundColor: backgroundColor,
    });
    // Update the status bar item based on the 'isEnabled' flag
    function updateStatusBarItem() {
        toggleStatusBarItem.text = isEnabled ? "[🎨 ON]" : "[🎨 OFF]";
        toggleStatusBarItem.color = isEnabled
            ? undefined
            : "rgba(255, 255, 255, 0.5)";
    }
    // Toggle the isEnabled flag and update the decorations
    const toggleCommand = vscode.commands.registerCommand("togglePHPBackground", () => {
        isEnabled = !isEnabled;
        updateStatusBarItem();
        updateDecorations();
    });
    context.subscriptions.push(toggleCommand);
    function updateDecorations() {
        if (!activeEditor) {
            return;
        }
        const phpDecorations = [];
        if (isEnabled) {
            const text = activeEditor.document.getText();
            let lines = text.split(/\n/);
            let insidePhpBlock = false;
            let openTagPosition = null;
            for (let i = 0; i < lines.length; i++) {
                let line = lines[i];
                if (/\<\?php/i.test(line)) {
                    // Case-insensitive match for PHP opening tag
                    insidePhpBlock = true;
                    openTagPosition = new vscode.Position(i, line.search(/\<\?php/i));
                }
                if (insidePhpBlock) {
                    let lineEnd = new vscode.Position(i, line.length);
                    const decoration = {
                        range: new vscode.Range(openTagPosition, lineEnd),
                        hoverMessage: "PHP block",
                    };
                    phpDecorations.push(decoration);
                }
                if (line.includes("?>")) {
                    insidePhpBlock = false;
                }
            }
        }
        activeEditor.setDecorations(phpDecorationType, phpDecorations);
    }
    if (activeEditor) {
        updateDecorations();
    }
    vscode.workspace.onDidChangeConfiguration((event) => {
        if (event.affectsConfiguration("phpCodeblockHighlighter.backgroundColor")) {
            config = vscode.workspace.getConfiguration("phpCodeblockHighlighter");
            backgroundColor = config.get("backgroundColor", "rgba(50, 120, 200, 0.5)");
            phpDecorationType.dispose();
            phpDecorationType = vscode.window.createTextEditorDecorationType({
                backgroundColor: backgroundColor,
            });
            updateDecorations();
        }
    });
    vscode.window.onDidChangeActiveTextEditor((editor) => {
        activeEditor = editor;
        if (editor) {
            updateDecorations();
        }
    }, null, context.subscriptions);
    vscode.workspace.onDidChangeTextDocument((event) => {
        if (activeEditor && event.document === activeEditor.document) {
            updateDecorations();
        }
    }, null, context.subscriptions);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=extension.js.map