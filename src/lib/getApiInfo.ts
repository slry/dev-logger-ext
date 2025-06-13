import * as vscode from "vscode";

let userSkippedSetup = false;

export const getApiInfo = async () => {
  const apiToken = vscode.workspace
    .getConfiguration("devLogger")
    .get<string>("apiToken");
  const apiUrl = vscode.workspace
    .getConfiguration("devLogger")
    .get<string>("apiUrl");

  if (!apiToken || !apiUrl) {
    if (userSkippedSetup) {
      vscode.window.showErrorMessage(
        "API URL or Token is missing in devLogger configuration. Please set them up in settings.",
      );
      return { apiToken: null, apiUrl: null };
    }

    const userResponse = await vscode.window.showInformationMessage(
      "API URL or Token is missing in devLogger configuration. Would you like to set them up now?",
      "Yes",
      "No",
    );

    if (!userResponse) {
      return { apiToken: null, apiUrl: null };
    }

    if (userResponse === "No") {
      userSkippedSetup = true;
      return { apiToken: null, apiUrl: null };
    }
  }

  if (!apiUrl) {
    const userInputApiUrl = await vscode.window.showInputBox({
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

    if (!userInputApiUrl) {
      vscode.window.showErrorMessage("API URL is required.");
      return { apiToken: null, apiUrl: null };
    }

    // Update the configuration with the new API URL
    await vscode.workspace.getConfiguration("devLogger").update("apiUrl", userInputApiUrl, vscode.ConfigurationTarget.Global);
  }

  if (!apiToken) {
    const userInputApiToken = await vscode.window.showInputBox({
      prompt: 'Please enter your logger API token',
      placeHolder: 'your-api-token',
      ignoreFocusOut: false,
      password: true,
    });

    if (!userInputApiToken) {
      vscode.window.showErrorMessage("API token is required.");
      return { apiToken: null, apiUrl: null };
    }

    // Update the configuration with the new API token
    await vscode.workspace.getConfiguration("devLogger").update("apiToken", userInputApiToken, vscode.ConfigurationTarget.Global);
  }

  return { apiToken, apiUrl };
};
