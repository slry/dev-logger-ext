import * as vscode from "vscode";
import { sendLocAPI, SendLocPayload } from "../api/loc";
import { getRelativeWorkspaceFilePath } from "../lib/getRelativeWorkspaceFilePath";

const fileChangesQueue: SendLocPayload["changes"] = [];
let batchTimer: NodeJS.Timeout | null = null;

export const useLoc = (context: vscode.ExtensionContext) => {
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

  // Send batch data when extension is deactivated
  context.subscriptions.push({
    dispose: () => {
      sendLocBatchData();
    },
  });
};

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

async function sendLocBatchData() {
  if (fileChangesQueue.length === 0) {
    return;
  }

  const payload = {
    changes: fileChangesQueue,
    timestamp: new Date().toISOString(),
  } satisfies SendLocPayload;

  console.log("Sending batch data ", payload.timestamp);

  await sendLocAPI(payload);

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
      file: getRelativeWorkspaceFilePath(filePath),
      added: linesAdded,
      deleted: linesDeleted,
    });
  }

  // Start the batch timer if not already running
  if (!batchTimer) {
    console.log("Starting batch timer");
    batchTimer = setTimeout(() => {
      sendLocBatchData();
      batchTimer = null;
    }, 5000); // Send batch every 5 seconds
  }
}
