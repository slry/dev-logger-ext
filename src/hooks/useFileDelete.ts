import * as vscode from "vscode";
import { sendFileDeleteAPI } from "../api/fileDelete";
import { getRelativeWorkspaceFilePath } from "../lib/getRelativeWorkspaceFilePath";
import { getGitRepo } from "../lib/getGitRepo";

export const useFileDelete = (context: vscode.ExtensionContext) => {
  const dispose = vscode.workspace.onDidDeleteFiles((event) => {
    event.files.forEach((file) => {
      const filename = getRelativeWorkspaceFilePath(file.fsPath);
      const currentRepoUrl = getGitRepo();
      if (filename) {
        // TODO: batch it
        sendFileDeleteAPI({
          filename,
          timestamp: new Date().toISOString(),
          operation: "DELETE",
          repoUrl: currentRepoUrl || null,
        });
      }
    });
  });

  context.subscriptions.push(dispose);
};
