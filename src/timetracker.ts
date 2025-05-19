import * as vscode from 'vscode';
import { sendTimeSpentAPI } from './api/time';
import { getGitRepo } from './lib/getGitRepo';

enum TimeTrackerState {
  IDLE = 'IDLE',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
}

export class TimeTracker {
  private state: TimeTrackerState;
  private disposable: vscode.Disposable;
  private sendTimer: NodeJS.Timeout | null;
  private sendInterval: number = 60_000;
  private timeoutTimer: NodeJS.Timeout | null;
  private timeout: number = 600_000;
  private startTime: number;

  constructor() {
    this.disposable = vscode.Disposable.from();
    this.state = TimeTrackerState.IDLE;
    this.sendTimer = null;
    this.timeoutTimer = null;
    this.startTime = Date.now();
  }

  public initialize() {
    this.setupEventListeners();

    this.sendTimer = setInterval(() => {
      if (this.state === TimeTrackerState.IDLE || !this.startTime) {
        return;
      }

      const currentTime = Date.now();

      const duration = currentTime - this.startTime;

      const currentRepoUrl = getGitRepo();

      sendTimeSpentAPI({
        timestamp: new Date().toISOString(),
        time: duration,
        repoUrl: currentRepoUrl || null,
      });

      this.startTime = currentTime;
    }, this.sendInterval);

    this.sendHeartbeat();
  }

  public dispose() {
    this.disposable.dispose();

    if (this.sendTimer) {
      clearInterval(this.sendTimer);
    }

    if (this.timeoutTimer) {
      clearTimeout(this.timeoutTimer);
    }
  }

  private sendHeartbeat() {
    if (this.timeoutTimer) {
      clearTimeout(this.timeoutTimer);
    }

    this.timeoutTimer = setTimeout(() => {
      this.state = TimeTrackerState.IDLE;
      console.log('User is idle');
    }, this.timeout);

    if (this.state === TimeTrackerState.IDLE) {
      this.startTime = Date.now();
      this.state = TimeTrackerState.ACTIVE;
      console.log('User is active');
    }
  }

  private setupEventListeners() {
    let subscriptions: vscode.Disposable[] = [];
    const boundSendHeartbeat = this.sendHeartbeat.bind(this);

    vscode.workspace.onDidChangeTextDocument(boundSendHeartbeat, null, subscriptions);
    vscode.workspace.onDidSaveTextDocument(boundSendHeartbeat, null, subscriptions);
    vscode.workspace.onDidCloseTextDocument(boundSendHeartbeat, null, subscriptions);
    vscode.workspace.onDidOpenTextDocument(boundSendHeartbeat, null, subscriptions);

    vscode.workspace.onDidChangeConfiguration(boundSendHeartbeat, null, subscriptions);
    vscode.workspace.onDidChangeWorkspaceFolders(boundSendHeartbeat, null, subscriptions);

    vscode.workspace.onDidCreateFiles(boundSendHeartbeat, null, subscriptions);
    vscode.workspace.onDidDeleteFiles(boundSendHeartbeat, null, subscriptions);
    vscode.workspace.onDidRenameFiles(boundSendHeartbeat, null, subscriptions);

    this.disposable = vscode.Disposable.from(...subscriptions);
  }

}
