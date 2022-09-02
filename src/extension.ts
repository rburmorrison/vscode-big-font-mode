// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated

  type Mode = 'big' | 'xl' | 'normal';

  let mode: Mode = 'normal';

  const resetFont = () => {
    vscode.commands.executeCommand('editor.action.fontZoomReset');
  };

  const enlargeFont = (magnitude: number) => {
    resetFont();
    for (let i = 0; i < magnitude; i++) {
      vscode.commands.executeCommand('editor.action.fontZoomIn');
    }
  };

  const enlargeCallback = (mode_: Mode, magnitude: number): (() => void) => {
    return () => {
      if (mode === 'normal') {
        mode = mode_;
      } else if (mode === mode_) {
        mode = 'normal';
      } else if (mode !== mode_) {
		mode = mode_;
	  }

      if (mode === mode_) {
        enlargeFont(magnitude);
      } else {
        vscode.commands.executeCommand('editor.action.fontZoomReset');
      }
    };
  };

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  context.subscriptions.push(vscode.commands.registerCommand(
    'big-font-mode.bigFontMode',
    enlargeCallback('big', 4)
  ));

  context.subscriptions.push(vscode.commands.registerCommand(
    'big-font-mode.xlFontMode',
    enlargeCallback('xl', 8)
  ));
}

// this method is called when your extension is deactivated
export function deactivate() {}
