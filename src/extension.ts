import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  let activeEditor = vscode.window.activeTextEditor;
  let isEnabled = true;

  // Create and show a status bar item
  const toggleStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  toggleStatusBarItem.command = "togglePHPBackground";
  toggleStatusBarItem.tooltip = "Toggle PHP Background Color";
  toggleStatusBarItem.text = isEnabled ? "[🎨 ON]" : "[🎨 OFF]";
  toggleStatusBarItem.show();
  context.subscriptions.push(toggleStatusBarItem);

  // Get the configuration for the background color
  let config = vscode.workspace.getConfiguration("phpCodeblockHighlighter");
  let backgroundColor = config.get(
    "backgroundColor",
    "rgba(50, 120, 200, 0.5)"
  );

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
    if (!activeEditor || !isEnabled) {
      return;
    }

    const text = activeEditor.document.getText();
    const phpDecorations: vscode.DecorationOptions[] = [];
    let lines = text.split(/\n/);
    let insidePhpBlock = false;
    let openTagPosition: vscode.Position | null = null;

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
          range: new vscode.Range(openTagPosition!, lineEnd),
          hoverMessage: "PHP block",
        };
        phpDecorations.push(decoration);
      }

      if (line.includes("?>")) {
        insidePhpBlock = false;
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
