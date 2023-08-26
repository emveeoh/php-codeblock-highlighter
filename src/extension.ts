import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  let activeEditor = vscode.window.activeTextEditor;

  let config = vscode.workspace.getConfiguration("phpCodeblockHighlighter");
  let backgroundColor = config.get(
    "backgroundColor",
    "rgba(50, 120, 200, 0.5)"
  );

  let phpDecorationType = vscode.window.createTextEditorDecorationType({
    backgroundColor: backgroundColor,
  });

  function updateDecorations() {
    if (!activeEditor) {
      return;
    }

    const regEx = /<\?php|\?>/g;
    const text = activeEditor.document.getText();
    const phpDecorations: vscode.DecorationOptions[] = [];
    let match;
    let openTagPosition: vscode.Position | null = null;

    while ((match = regEx.exec(text))) {
      const startPos = activeEditor.document.positionAt(match.index);
      const endPos = activeEditor.document.positionAt(
        match.index + match[0].length
      );

      if (match[0] === "<?php") {
        openTagPosition = startPos;
      } else if (match[0] === "?>" && openTagPosition) {
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
      backgroundColor = config.get(
        "backgroundColor",
        "rgba(255, 0, 255, 0.25)"
      );
      phpDecorationType.dispose();
      phpDecorationType = vscode.window.createTextEditorDecorationType({
        backgroundColor: backgroundColor,
      });
      updateDecorations();
    }
  });

  vscode.window.onDidChangeActiveTextEditor(
    (editor) => {
      activeEditor = editor;
      if (editor) {
        updateDecorations();
      }
    },
    null,
    context.subscriptions
  );

  vscode.workspace.onDidChangeTextDocument(
    (event) => {
      if (activeEditor && event.document === activeEditor.document) {
        updateDecorations();
      }
    },
    null,
    context.subscriptions
  );
}

export function deactivate() {}
