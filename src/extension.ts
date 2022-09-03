import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
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
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage('Could not detect an active editor.');
        return;
      }

      // Dependeng on the current mode, set mode to the appropriate alternate
      // mode.
      //
      // The graph below illustrates the mode transformations, where X
      // represents the current mode and Y represents the target mode, the
      // intersection represents the new mode.
      //
      // |        | Normal | Big    | XL     |
      // |--------+--------+--------+--------|
      // | Normal |   X    | Big    | XL     |
      // | Big    |   X    | Normal | XL     |
      // | XL     |   X    | Big    | Normal |

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

      // Ensure that the cursor is still on the page after a mode change.

      const range = editor.selection;
      if (range) {
        editor.revealRange(range);
      }
    };
  };

  //~~~~~~~~~~~~~~~//
  // BIG FONT MODE //
  //~~~~~~~~~~~~~~~//

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'big-font-mode.bigFontMode',
      enlargeCallback('big', 4)
    )
  );

  //~~~~~~~~~~~~~~//
  // XL FONT MODE //
  //~~~~~~~~~~~~~~//

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'big-font-mode.xlFontMode',
      enlargeCallback('xl', 8)
    )
  );
}

export function deactivate() {}
