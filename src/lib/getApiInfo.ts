import * as vscode from "vscode";

export const getApiInfo = async () => {
  const apiToken = vscode.workspace
    .getConfiguration("devLogger")
    .get<string>("apiToken");
  const apiUrl = vscode.workspace
    .getConfiguration("devLogger")
    .get<string>("apiUrl");


  if (!apiUrl) {
    const apiUrl = await vscode.window.showInputBox({
      prompt: 'Please enter your logger API URL',
      placeHolder: 'https://your-logger-api.com',
      ignoreFocusOut: false,
      validateInput: (value) => {
        if (!value.startsWith("http://") && !value.startsWith("https://")) {
          return "API URL must start with http:// or https://";
        }

        if (value.endsWith("/")) {
          return "API URL should not end with a slash (/)";
        }

        return null; // No error
      }
    });

    if (!apiUrl) {
      vscode.window.showErrorMessage("API URL is required.");
      return { apiToken: null, apiUrl: null };
    }

    // Update the configuration with the new API URL
    await vscode.workspace.getConfiguration("devLogger").update("apiUrl", apiUrl, vscode.ConfigurationTarget.Global);
  }

  if (!apiToken) {
    const apiToken = await vscode.window.showInputBox({
      prompt: 'Please enter your logger API token',
      placeHolder: 'your-api-token',
      ignoreFocusOut: false,
      password: true,
    });

    if (!apiToken) {
      vscode.window.showErrorMessage("API token is required.");
      return { apiToken: null, apiUrl: null };
    }

    // Update the configuration with the new API token
    await vscode.workspace.getConfiguration("devLogger").update("apiToken", apiToken, vscode.ConfigurationTarget.Global);
  }

  return { apiToken, apiUrl };
};
