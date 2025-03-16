import * as vscode from "vscode";
import { baseApi } from "./baseApi";

interface SendFileCreatePayload {
  filename: string;
  timestamp: string;
  operation: "CREATE";
}

export const sendFileCreateAPI = async (payload: SendFileCreatePayload) => {
  try {
    const response = await baseApi("/api/file", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const jsonError = await response.json();
      vscode.window.showErrorMessage(
        `Failed to send file create data: ${jsonError}`,
      );
    }
  } catch (error) {
    vscode.window.showErrorMessage(`Error sending file create data: ${error}`);
  }
};
