import * as vscode from "vscode";
import { baseApi } from "./baseApi";

export const getGitlabRepos = async () => {
  try {
    const response = await baseApi("/api/gitlab/repos", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const jsonError = await response.json();
      vscode.window.showErrorMessage(
        `Failed to fetch GitLab repos: ${jsonError}`,
      );
      return [];
    }

    const responseData = await response.json() as {
      data: string[];
    };

    const reposUrls = responseData.data;

    return reposUrls;
  } catch (error) {
    vscode.window.showErrorMessage(`Error fetching GitLab repos: ${error}`);
  }
};
