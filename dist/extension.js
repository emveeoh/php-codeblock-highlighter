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
    let config = vscode.workspace.getConfiguration("phpCodeblockHighlighter");
    let backgroundColor = config.get("backgroundColor", "rgba(50, 120, 200, 0.5)");
    let phpDecorationType = vscode.window.createTextEditorDecorationType({
        backgroundColor: backgroundColor,
    });
    function updateDecorations() {
        if (!activeEditor) {
            return;
        }
        const regEx = /<\?php|\?>/g;
        const text = activeEditor.document.getText();
        const phpDecorations = [];
        let match;
        let openTagPosition = null;
        while ((match = regEx.exec(text))) {
            const startPos = activeEditor.document.positionAt(match.index);
            const endPos = activeEditor.document.positionAt(match.index + match[0].length);
            if (match[0] === "<?php") {
                openTagPosition = startPos;
            }
            else if (match[0] === "?>" && openTagPosition) {
                const decoration = {
                    range: new vscode.Range(openTagPosition, endPos),
                    hoverMessage: "PHP block",
                };
                phpDecorations.push(decoration);
                openTagPosition = null;
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
            backgroundColor = config.get("backgroundColor", "rgba(255, 0, 255, 0.25)");
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