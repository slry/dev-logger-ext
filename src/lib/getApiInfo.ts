import * as vscode from "vscode";

export const getApiInfo = () => {
  const apiToken = vscode.workspace
    .getConfiguration("devLogger")
    .get<string>("apiToken");
  const apiUrl = vscode.workspace
    .getConfiguration("devLogger")
    .get<string>("apiUrl");

  if (!apiUrl || !apiToken) {
    vscode.window.showErrorMessage(
      "API URL or Token is missing in devLogger configuration.",
    );
  }

  return { apiToken, apiUrl };
};
