import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  let activeEditor = vscode.window.activeTextEditor;
  let isEnabled = true;

  const toggleStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  toggleStatusBarItem.command = "togglePHPBackground";
  toggleStatusBarItem.tooltip = "Toggle PHP Background Color";
  toggleStatusBarItem.text = isEnabled ? "🎨 On" : "🎨 Off";
  context.subscriptions.push(toggleStatusBarItem);
  toggleStatusBarItem.show();

  let config = vscode.workspace.getConfiguration("phpCodeblockHighlighter");
  let backgroundColor = config.get(
    "backgroundColor",
    "rgba(50, 120, 200, 0.5)"
  );

  let phpDecorationType = vscode.window.createTextEditorDecorationType({
    backgroundColor: backgroundColor,
  });

  function updateStatusBarItem() {
    toggleStatusBarItem.text = isEnabled ? "🎨 On" : "🎨 Off";
    toggleStatusBarItem.color = isEnabled
      ? undefined
      : "rgba(255, 255, 255, 0.5)";
  }

  const toggleCommand = vscode.commands.registerCommand(
    "togglePHPBackground",
    () => {
      isEnabled = !isEnabled;
      updateStatusBarItem();
      updateDecorations();
    }
  );

  context.subscriptions.push(toggleCommand);

  function updateDecorations() {
    if (!activeEditor) {
      return;
    }

    const phpDecorations: vscode.DecorationOptions[] = [];

    if (isEnabled) {
      const text = activeEditor.document.getText();
      let lines = text.split(/\n/);
      let insidePhpBlock = false;
      let openTagPosition: vscode.Position | null = null;

      for (let i = 0; i < lines.length; i++) {
        let line = lines[i];

        if (/\<\?php/i.test(line)) {
          insidePhpBlock = true;
          openTagPosition = new vscode.Position(i, line.search(/\<\?php/i));
        }

        if (insidePhpBlock) {
          let lineEnd = new vscode.Position(i, line.length);
          if (line.includes("?>")) {
            lineEnd = new vscode.Position(i, line.indexOf("?>") + 2); // +2 to include the '?>'
            insidePhpBlock = false; // Close the PHP block
          }
          const decoration = {
            range: new vscode.Range(openTagPosition!, lineEnd),
            hoverMessage: "PHP block",
          };
          phpDecorations.push(decoration);
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
      backgroundColor = config.get(
        "backgroundColor",
        "rgba(50, 120, 200, 0.5)"
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
