import * as vscode from "vscode";
import { sendFileDeleteAPI } from "../api/fileDelete";
import { getRelativeWorkspaceFilePath } from "../lib/getRelativeWorkspaceFilePath";

export const useFileDelete = (context: vscode.ExtensionContext) => {
  vscode.workspace.onDidDeleteFiles((event) => {
    event.files.forEach((file) => {
      const filename = getRelativeWorkspaceFilePath(file.fsPath);
      if (filename) {
        // TODO: batch it
        sendFileDeleteAPI({
          filename,
          timestamp: new Date().toISOString(),
          operation: "DELETE",
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
