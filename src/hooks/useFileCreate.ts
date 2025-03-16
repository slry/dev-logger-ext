import * as vscode from "vscode";
import { sendFileCreateAPI } from "../api/fileCreate";
import { getRelativeWorkspaceFilePath } from "../lib/getRelativeWorkspaceFilePath";

export const useFileCreate = (context: vscode.ExtensionContext) => {
  vscode.workspace.onDidCreateFiles((event) => {
    event.files.forEach((file) => {
      console.log(file.fsPath, getRelativeWorkspaceFilePath(file.fsPath));
      const filename = getRelativeWorkspaceFilePath(file.fsPath);
      if (filename) {
        // TODO: batch it
        sendFileCreateAPI({
          filename,
          timestamp: new Date().toISOString(),
          operation: "CREATE",
        });
      }
    });
  });

  context.subscriptions.push({
    dispose: () => {
      vscode.workspace.onDidCreateFiles(() => { });
    },
  });
};
