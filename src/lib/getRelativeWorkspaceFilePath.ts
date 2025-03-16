import * as vscode from "vscode";

export const getRelativeWorkspaceFilePath = (filename: string) => {
  return vscode.workspace.asRelativePath(filename, true);
};
