import * as vscode from "vscode";
import type { API as GitAPI, GitExtension, APIState } from './types/gitext.d.ts';

export const getGitRepo = () => {

  const gitExtension = vscode.extensions.getExtension<GitExtension>("vscode.git");
  if (!gitExtension) {
    return null;
  }

  const gitApi = gitExtension.exports.getAPI(1);

  // get origin
  const repo = gitApi.repositories[0];
  if (!repo) {
    return null;
  }

  const remotes = repo.state.remotes;

  if (remotes.length === 0) {
    return null;
  }

  const origin = remotes.find((remote) => remote.name === "origin");

  if (!origin) {
    return null;
  }

  if (!origin.fetchUrl) {
    return null;
  }

  return origin.fetchUrl.replace(/\.git$/, "");
};
