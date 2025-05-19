import * as vscode from "vscode";
import { sendFileCreateAPI } from "../api/fileCreate";
import { getRelativeWorkspaceFilePath } from "../lib/getRelativeWorkspaceFilePath";
import { getGitRepo } from "../lib/getGitRepo";

export const useFileCreate = (context: vscode.ExtensionContext) => {
  const dispose = vscode.workspace.onDidCreateFiles((event) => {
    event.files.forEach((file) => {
      console.log(file.fsPath, getRelativeWorkspaceFilePath(file.fsPath));
      const currentRepoUrl = getGitRepo();
      const filename = getRelativeWorkspaceFilePath(file.fsPath);
      if (filename) {
        // TODO: batch it
        sendFileCreateAPI({
          filename,
          timestamp: new Date().toISOString(),
          operation: "CREATE",
          repoUrl: currentRepoUrl || null,
        });
      }
    });
  });

  context.subscriptions.push(dispose);
};
