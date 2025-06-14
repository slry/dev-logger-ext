# 🧩 Dev Logger VSCode Extension

The **Dev Logger VSCode Extension** logs developer activity from your editor to a self-hosted Dev Logger backend. It helps track file-level events and lines of code in real-time — perfect for personal retrospectives, team productivity, or agile metrics.

> Works out-of-the-box with [slry/dev-logger](https://github.com/slry/dev-logger) as the backend.

---

## 🔍 Features

- ✍️ **File Activity Tracking**  
  Log file creation, modification, and deletion events automatically.

- 📊 **LOC Metrics**  
  Track how many lines are added/removed across sessions.

- 🔗 **Backend Integration**  
  Sends data to your own Dev Logger instance

- 🪄 **Minimal UI**  
  Auto-starts in the background — just configure once and let it run.

---

## ⚙️ Configuration

After installing the extension, open VSCode settings and look for:

```

Dev Logger › Api Url: http://localhost:3000
Dev Logger › Api Token: your-api-token

````

These correspond to the values you configure in your self-hosted Dev Logger dashboard (`/settings` page).

---

## 🚀 Getting Started

### 1. Install the Extension

Download from the [Visual Studio Marketplace](https://marketplace.visualstudio.com/) or manually:

```bash
git clone https://github.com/slry/dev-logger-ext.git
cd dev-logger
pnpm install
pnpm run package
````

Then in VSCode:

* Open Command Palette → `Extensions: Install from VSIX`
* Select the generated `.vsix` file

---

### 2. Set API URL and Token

In VSCode:

1. Open `Preferences > Settings`
2. Search for `Dev Logger`
3. Fill in:

   * **API URL**: `http://localhost:3000`
   * **API Token**: (from your backend user profile)

---

## 🧪 Development

```bash
cd extension
pnpm install
pnpm run watch
```

Launch a new Extension Development Host from VSCode to test live changes.

---

## 📄 License

MIT License © 2025 [Vyacheslav Rybalchenko](https://github.com/slry)

---

## 💬 Feedback & Contributions

Found a bug or have a feature idea?
Open an issue or PR at [slry/dev-logger](https://github.com/slry/dev-logger).
