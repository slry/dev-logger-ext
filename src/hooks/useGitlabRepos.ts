import * as vscode from "vscode";
import { getGitlabRepos } from "../api/gitlabRepos";

export const useGitlabRepos = async (context: vscode.ExtensionContext) => {
  const fetchGitlabRepos = async () => {
    const gitlabRepos = await getGitlabRepos();

    context.globalState.update("gitlabRepos", gitlabRepos);
  };

  const disposable = vscode.workspace.onDidChangeConfiguration(fetchGitlabRepos);

  context.subscriptions.push(disposable);
};
