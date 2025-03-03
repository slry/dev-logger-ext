// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

const fileChangesQueue: { file: string; added: number; deleted: number }[] = [];
let batchTimer: NodeJS.Timeout | null = null;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "dev-logger-ext" is now active!',
  );

  const fileLineCounts = new Map<string, number>();

  // Track initial line count for all open documents
  vscode.workspace.textDocuments.forEach((document) => {
    trackInitialLineCount(document, fileLineCounts);
  });

  // Track line count for all documents

  vscode.workspace.onDidOpenTextDocument((document) => {
    trackInitialLineCount(document, fileLineCounts);
  });

  vscode.workspace.onDidChangeTextDocument((event) => {
    trackLineChanges(event, fileLineCounts);
  });

  vscode.workspace.onDidCloseTextDocument((document) => {
    fileLineCounts.delete(document.uri.fsPath);
  });
}

function trackInitialLineCount(
  document: vscode.TextDocument,
  fileLineCounts: Map<string, number>,
) {
  fileLineCounts.set(document.uri.fsPath, document.lineCount);
}

function trackLineChanges(
  event: vscode.TextDocumentChangeEvent,
  fileLineCounts: Map<string, number>,
) {
  const document = event.document;
  const filePath = document.uri.fsPath;

  const prevLineCount = fileLineCounts.get(filePath) ?? 0;
  const newLineCount = document.lineCount;

  let linesAdded = 0;
  let linesDeleted = 0;

  if (newLineCount > prevLineCount) {
    linesAdded = newLineCount - prevLineCount;
  } else if (newLineCount < prevLineCount) {
    linesDeleted = prevLineCount - newLineCount;
  }

  if (linesAdded > 0 || linesDeleted > 0) {
    queueFileChange(filePath, linesAdded, linesDeleted);
  }

  // Update stored line count
  fileLineCounts.set(filePath, newLineCount);
}

async function sendBatchData() {
  if (fileChangesQueue.length === 0) {
    return;
  }

  const apiToken = vscode.workspace
    .getConfiguration("devLogger")
    .get("apiToken");
  const apiUrl = vscode.workspace.getConfiguration("devLogger").get("apiUrl");

  if (!apiUrl || !apiToken) {
    vscode.window.showErrorMessage(
      "API URL or Token is missing in devLogger configuration.",
    );
    return;
  }

  const payload = {
    changes: fileChangesQueue,
    timestamp: new Date().toISOString(),
  };

  console.log("Sending batch data ", payload.timestamp);

  try {
    const response = await fetch(`${apiUrl}/api/loc?token=${apiToken}`, {
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

  // Clear queue after sending
  fileChangesQueue.length = 0;
}

function queueFileChange(
  filePath: string,
  linesAdded: number,
  linesDeleted: number,
) {
  // Merge with existing entry if the file is already in the queue
  const existingEntry = fileChangesQueue.find(
    (entry) => entry.file === filePath,
  );

  if (existingEntry) {
    existingEntry.added += linesAdded;
    existingEntry.deleted += linesDeleted;
  } else {
    fileChangesQueue.push({
      file: filePath,
      added: linesAdded,
      deleted: linesDeleted,
    });
  }

  // Start the batch timer if not already running
  if (!batchTimer) {
    console.log("Starting batch timer");
    batchTimer = setTimeout(() => {
      sendBatchData();
      batchTimer = null;
    }, 5000); // Send batch every 5 seconds
  }
}

// This method is called when your extension is deactivated
export function deactivate() {}
