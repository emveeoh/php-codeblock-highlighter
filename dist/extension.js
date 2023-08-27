(()=>{"use strict";var o={496:o=>{o.exports=require("vscode")}},e={};function t(n){var r=e[n];if(void 0!==r)return r.exports;var i=e[n]={exports:{}};return o[n](i,i.exports,t),i.exports}var n={};(()=>{var o=n;Object.defineProperty(o,"__esModule",{value:!0}),o.deactivate=o.activate=void 0;const e=t(496);o.activate=function(o){let t=e.window.activeTextEditor,n=!0;const r=e.window.createStatusBarItem(e.StatusBarAlignment.Right,100);r.command="togglePHPBackground",r.tooltip="Toggle PHP Background Color",r.text=n?"[🎨 ON]":"[🎨 OFF]",r.show(),o.subscriptions.push(r);let i=e.workspace.getConfiguration("phpCodeblockHighlighter"),a=i.get("backgroundColor","rgba(50, 120, 200, 0.5)"),c=e.window.createTextEditorDecorationType({backgroundColor:a});const s=e.commands.registerCommand("togglePHPBackground",(()=>{n=!n,r.text=n?"[🎨 ON]":"[🎨 OFF]",r.color=n?void 0:"rgba(255, 255, 255, 0.5)",g()}));function g(){if(!t)return;const o=[];if(n){let n=t.document.getText().split(/\n/),r=!1,i=null;for(let t=0;t<n.length;t++){let a=n[t];if(/\<\?php/i.test(a)&&(r=!0,i=new e.Position(t,a.search(/\<\?php/i))),r){let n=new e.Position(t,a.length);const r={range:new e.Range(i,n),hoverMessage:"PHP block"};o.push(r)}a.includes("?>")&&(r=!1)}}t.setDecorations(c,o)}o.subscriptions.push(s),t&&g(),e.workspace.onDidChangeConfiguration((o=>{o.affectsConfiguration("phpCodeblockHighlighter.backgroundColor")&&(i=e.workspace.getConfiguration("phpCodeblockHighlighter"),a=i.get("backgroundColor","rgba(50, 120, 200, 0.5)"),c.dispose(),c=e.window.createTextEditorDecorationType({backgroundColor:a}),g())})),e.window.onDidChangeActiveTextEditor((o=>{t=o,o&&g()}),null,o.subscriptions),e.workspace.onDidChangeTextDocument((o=>{t&&o.document===t.document&&g()}),null,o.subscriptions)},o.deactivate=function(){}})(),module.exports=n})();