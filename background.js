chrome.runtime.onInstalled.addListener(() => {
    setupReminderAlarm();
});

chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "updateAlarm") {
        setupReminderAlarm(message.interval);
    }
});

function setupReminderAlarm(interval = 60) {
    chrome.alarms.clear("motivationAlarm", () => {
        setTimeout(() => {  
            chrome.alarms.create("motivationAlarm", {
                delayInMinutes: interval,
                periodInMinutes: interval
            });
        }, 100);
    });
}

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "motivationAlarm") {
        showMotivationalNotification();
    }
});

function showMotivationalNotification() {
    chrome.storage.local.get("lastNotificationTime", (data) => {
        let lastTime = data.lastNotificationTime || 0;
        let now = Date.now();

        // Prevent duplicate notifications within 10 minutes
        if (now - lastTime > 600000) {
            const messages = [
                "Keep pushing forward!",
                "Believe in yourself!",
                "Every day is a new opportunity!",
                "You are capable of amazing things!",
                "Success is a journey, not a destination."
            ];

            let message = messages[Math.floor(Math.random() * messages.length)];

            chrome.notifications.create({
                type: "basic",
                iconUrl: "icons/icon48.png",
                title: "AdFriend Motivation",
                message: message
            });

            // Save last notification time
            chrome.storage.local.set({ lastNotificationTime: now });
        }
    });
}
