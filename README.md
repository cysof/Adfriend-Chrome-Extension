# AdFriend - Replace Ads with Motivation

## 🚀 Overview
AdFriend is a Chrome extension designed to enhance your browsing experience by replacing intrusive ads with motivational quotes and reminders. Stay inspired while surfing the web!

## 📌 Features
- 🔄 **Ad Replacement** - Replaces advertisements with uplifting motivational quotes.
- ⏰ **Custom Reminders** - Set periodic reminders to stay on track with your goals.
- 🔔 **Notifications** - Receive motivational messages at custom intervals.
- 📊 **Storage Support** - Saves your last notification time to prevent excessive interruptions.

## 🛠 Installation
1. Download or clone this repository.
2. Open **chrome://extensions/** in your browser.
3. Enable **Developer mode** (top-right corner).
4. Click **Load unpacked** and select the extension folder.
5. Enjoy a distraction-free, motivational browsing experience!

## 📜 Manifest
This extension uses **Manifest V3** for better security and performance.
```json
{
    "manifest_version": 3,
    "name": "AdFriend",
    "version": "1.0",
    "description": "Replace ads with motivational quotes and reminders.",
    "permissions": ["storage", "declarativeNetRequest", "alarms"],
    "host_permissions": ["<all_urls>"],
    "background": {
      "service_worker": "background.js"
    },
    "action": {
      "default_popup": "popup.html",
      "default_icon": {
        "16": "icons/icon16.png",
        "48": "icons/icon48.png",
        "128": "icons/icon128.png"
      }
    },
    "content_scripts": [
      {
        "matches": ["<all_urls>"],
        "js": ["content.js"]
      }
    ]
}
```

## 🔧 How It Works
1. **Detects Ads** - The extension identifies and hides ads on web pages.
2. **Replaces Content** - Instead of an ad, it displays a motivational quote.
3. **Sends Notifications** - Periodically sends motivational reminders via Chrome notifications.
4. **Stores Data** - Uses `chrome.storage.local` to save the last notification timestamp.

## 🖥 Usage
- Click the extension icon to manually trigger a motivational quote.
- Customize reminder intervals from the popup menu.
- Enable/disable notifications anytime.

## 📌 Troubleshooting
### **Common Issues & Fixes**
#### ❌ Error: `Cannot read properties of undefined (reading 'onAlarm')`
✅ **Fix:** Ensure `"alarms"` is included in `permissions` in `manifest.json`.
#### ❌ Error: `'webRequestBlocking' requires manifest version of 2 or lower.`
✅ **Fix:** Remove `"webRequestBlocking"` and use `"declarativeNetRequest"` instead.
#### ❌ Error: `Icon Invalid`
✅ **Fix:** Ensure `icons/icon16.png`, `icons/icon48.png`, and `icons/icon128.png` exist in the project.

## 🛠 Technologies Used
- **JavaScript** (for functionality)
- **Chrome Extensions API** (for integration)
- **HTML & CSS** (for UI design)

## 📜 License
This project is licensed under the **MIT License**.

## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss proposed modifications.

## 📞 Contact
For any questions or suggestions, feel free to reach out!

💡 **Enjoy a distraction-free, motivational browsing experience with AdFriend!** 🚀

