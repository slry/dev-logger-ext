import * as vscode from "vscode";
import { baseApi } from "./baseApi";

interface SendTimeSpentPayload {
  timestamp: string;
  time: number;
  repoUrl: string | null;
}

export const sendTimeSpentAPI = async (payload: SendTimeSpentPayload) => {
  try {
    const response = await baseApi("/api/time", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const jsonError = await response.json();
      vscode.window.showErrorMessage(`Failed to send time spent data: ${jsonError}`);
    }
  } catch (error) {
    vscode.window.showErrorMessage(`Error sending time spent data: ${error}`);
  }
};
