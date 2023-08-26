(()=>{"use strict";var o={496:o=>{o.exports=require("vscode")}},e={};function t(n){var r=e[n];if(void 0!==r)return r.exports;var i=e[n]={exports:{}};return o[n](i,i.exports,t),i.exports}var n={};(()=>{var o=n;Object.defineProperty(o,"__esModule",{value:!0}),o.deactivate=o.activate=void 0;const e=t(496);let r=!0;o.activate=function(o){let t=e.window.activeTextEditor,n=e.workspace.getConfiguration("phpCodeblockHighlighter"),i=n.get("backgroundColor","rgba(50, 120, 200, 0.5)"),c=e.window.createTextEditorDecorationType({backgroundColor:i});const a=e.window.createStatusBarItem(e.StatusBarAlignment.Right,100);function s(o){r?(o.text="🎨On",o.color=void 0):(o.text="🎨Off",o.color="rgba(255, 255, 255, 0.5)"),o.tooltip="Toggle PHP Background Color",o.show()}a.command="togglePHPBackground",s(a),o.subscriptions.push(a);const u=e.commands.registerCommand("togglePHPBackground",(()=>{r=!r,s(a),d()}));function d(){if(!t)return;const o=/<\?php|\?>/g,n=t.document.getText(),i=[];let a,s=null;for(;a=o.exec(n);){const o=t.document.positionAt(a.index),n=t.document.positionAt(a.index+a[0].length);if("<?php"===a[0])s=o;else if("?>"===a[0]&&s){const o={range:new e.Range(s,n),hoverMessage:"PHP block"};i.push(o),s=null}}r?t.setDecorations(c,i):t.setDecorations(c,[])}o.subscriptions.push(u),t&&d(),e.workspace.onDidChangeConfiguration((o=>{o.affectsConfiguration("phpCodeblockHighlighter.backgroundColor")&&(n=e.workspace.getConfiguration("phpCodeblockHighlighter"),i=n.get("backgroundColor","rgba(255, 0, 255, 0.25)"),c.dispose(),c=e.window.createTextEditorDecorationType({backgroundColor:i}),d())})),e.window.onDidChangeActiveTextEditor((o=>{t=o,o&&d()}),null,o.subscriptions),e.workspace.onDidChangeTextDocument((o=>{t&&o.document===t.document&&d()}),null,o.subscriptions)},o.deactivate=function(){}})(),module.exports=n})();