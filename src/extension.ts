import * as vscode from "vscode";

let isEnabled = true; // Variable to keep track of the state (enabled/disabled)

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

  // Create status bar item
  const toggleStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  toggleStatusBarItem.command = "togglePHPBackground";
  updateStatusBarItem(toggleStatusBarItem); // Initialize

  // Add to context.subscriptions to ensure they are disposed of
  context.subscriptions.push(toggleStatusBarItem);

  function updateStatusBarItem(item: vscode.StatusBarItem) {
    if (isEnabled) {
      item.text = `🎨On`;
      item.color = undefined; // Reset to default color
    } else {
      item.text = `🎨Off`;
      item.color = "rgba(255, 255, 255, 0.5)"; // 50% transparency
    }
    item.tooltip = "Toggle PHP Background Color"; // Tooltip for more information
    item.show();
  }

  // Register the command to toggle the background
  const toggleCommand = vscode.commands.registerCommand(
    "togglePHPBackground",
    () => {
      isEnabled = !isEnabled; // Toggle the state
      updateStatusBarItem(toggleStatusBarItem); // Update status bar item
      updateDecorations(); // Update decorations based on the new state
    }
  );

  // Add to context.subscriptions to ensure they are disposed of
  context.subscriptions.push(toggleCommand);

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

    if (isEnabled) {
      activeEditor.setDecorations(phpDecorationType, phpDecorations);
    } else {
      activeEditor.setDecorations(phpDecorationType, []); // Clear the decorations if disabled
    }
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
