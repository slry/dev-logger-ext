// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { useLoc } from "./hooks/useLoc";
import { useFileDelete } from "./hooks/useFileDelete";
import { useFileCreate } from "./hooks/useFileCreate";
import { TimeTracker } from "./timetracker";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "dev-logger-ext" is now active!',
  );

  const timeTracker = new TimeTracker();

  useLoc(context);
  useFileCreate(context);
  useFileDelete(context);

  timeTracker.initialize();

  context.subscriptions.push(timeTracker);
}

// This method is called when your extension is deactivated
export function deactivate() { }
