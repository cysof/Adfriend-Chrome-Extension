document.addEventListener("DOMContentLoaded", () => {
    const saveButton = document.getElementById("save");
    const refreshButton = document.getElementById("refresh");
    const addCustomButton = document.getElementById("addCustom");
    const customTextInput = document.getElementById("customText");
    const customList = document.getElementById("customList");
    const toggleSwitch = document.getElementById("toggleAdFriend");
    const toggleLabel = document.getElementById("toggleLabel");
    const saveAdSettingsButton = document.getElementById("saveAdSettings");
    const reminderIntervalSelect = document.getElementById("reminderInterval");
    const saveReminderButton = document.getElementById("saveReminderSettings");

    const adSettings = {
        blockBanners: document.getElementById("blockBanners"),
        blockVideos: document.getElementById("blockVideos"),
        blockPopups: document.getElementById("blockPopups")
    };

    // Load synced settings
    chrome.storage.sync.get(["enabled", "contentType", "customEntries", "adSettings", "reminderInterval"], (data) => {
        if (data.enabled !== undefined) {
            toggleSwitch.checked = data.enabled;
            toggleLabel.innerText = data.enabled ? "Extension Enabled" : "Extension Disabled";
        }
        if (data.contentType) {
            document.querySelector(`input[value="${data.contentType}"]`).checked = true;
        }
        if (data.customEntries) {
            data.customEntries.forEach(entry => addListItem(entry));
        }
        if (data.adSettings) {
            Object.keys(adSettings).forEach(key => {
                adSettings[key].checked = data.adSettings[key];
            });
        }
        if (data.reminderInterval) {
            reminderIntervalSelect.value = data.reminderInterval;
        }
    });

    // Save user preference (sync across devices)
    saveButton.addEventListener("click", () => {
        const selectedOption = document.querySelector("input[name='contentType']:checked").value;
        chrome.storage.sync.set({ contentType: selectedOption }, () => {
            alert("Preferences saved and synced across devices!");
        });
    });

    // Refresh page button
    refreshButton.addEventListener("click", () => {
        chrome.tabs.reload();
    });

    // Add custom entry
    addCustomButton.addEventListener("click", () => {
        const newText = customTextInput.value.trim();
        if (newText === "") return;

        chrome.storage.sync.get("customEntries", (data) => {
            let customEntries = data.customEntries || [];
            customEntries.push(newText);

            chrome.storage.sync.set({ customEntries }, () => {
                addListItem(newText);
                customTextInput.value = "";
            });
        });
    });

    // Toggle AdFriend on/off
    toggleSwitch.addEventListener("change", () => {
        let isEnabled = toggleSwitch.checked;
        chrome.storage.sync.set({ enabled: isEnabled }, () => {
            toggleLabel.innerText = isEnabled ? "Extension Enabled" : "Extension Disabled";
        });
    });

    // Save ad preferences
    saveAdSettingsButton.addEventListener("click", () => {
        let newSettings = {};
        Object.keys(adSettings).forEach(key => {
            newSettings[key] = adSettings[key].checked;
        });

        chrome.storage.sync.set({ adSettings: newSettings }, () => {
            alert("Ad preferences saved!");
        });
    });

    // Save reminder frequency
    saveReminderButton.addEventListener("click", () => {
        const selectedInterval = parseInt(reminderIntervalSelect.value);
        chrome.storage.sync.set({ reminderInterval: selectedInterval }, () => {
            chrome.runtime.sendMessage({ action: "updateAlarm", interval: selectedInterval });
            alert("Reminder settings saved!");
        });
    });

    // Function to add a list item
    function addListItem(text) {
        let li = document.createElement("li");
        li.innerText = text;

        let deleteBtn = document.createElement("button");
        deleteBtn.innerText = "❌";
        deleteBtn.style.marginLeft = "10px";
        deleteBtn.onclick = () => removeEntry(text, li);

        li.appendChild(deleteBtn);
        customList.appendChild(li);
    }

    // Function to remove an entry
    function removeEntry(text, listItem) {
        chrome.storage.sync.get("customEntries", (data) => {
            let customEntries = data.customEntries || [];
            customEntries = customEntries.filter(entry => entry !== text);

            chrome.storage.sync.set({ customEntries }, () => {
                listItem.remove();
            });
        });
    }
});
