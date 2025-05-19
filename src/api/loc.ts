import * as vscode from "vscode";
import { baseApi } from "./baseApi";

export interface SendLocPayload {
  changes: { file: string; added: number; deleted: number }[];
  timestamp: string;
  repoUrl: string | null;
}
export const sendLocAPI = async (payload: SendLocPayload) => {
  try {
    const response = await baseApi("/api/loc", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const jsonError = await response.json();
      vscode.window.showErrorMessage(`Failed to send batch data: ${jsonError}`);
    }
  } catch (error) {
    vscode.window.showErrorMessage(`Error sending batch data: ${error}`);
  }
};
