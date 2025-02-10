function getRandomFromList(list) {
    if (!Array.isArray(list) || list.length === 0) {
        return "No custom entries available"; // Default fallback message
    }
    const randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex];
}

async function checkAdsUsingAPI(elements) {
    let elementsHTML = elements.map(el => el.outerHTML);

    try {
        let response = await fetch("https://your-ad-detection-api.com/checkAdsBatch", {
            method: "POST",
            body: JSON.stringify({ elements: elementsHTML }),
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) throw new Error("API request failed");

        let results = await response.json();
        return results.isAds || elements.map(() => false);
    } catch (error) {
        console.error("Ad API error:", error);
        return elements.map(() => false);
    }
}

function replaceAds() {
    chrome.storage.sync.get(["enabled", "contentType", "customEntries", "adSettings"], async (data) => {
        if (!data.enabled) return;

        const contentType = data.contentType || "quotes";
        const customEntries = data.customEntries || [];
        const adSettings = data.adSettings || { blockBanners: true, blockVideos: true, blockPopups: true };

        let replacementText = customEntries.length > 0
            ? getRandomFromList(customEntries)
            : contentType === "quotes"
                ? getRandomQuote()
                : getRandomReminder();

        let adSelectors = [];
        if (adSettings.blockBanners) adSelectors.push("[id*=ad], [class*=ad], iframe");
        if (adSettings.blockVideos) adSelectors.push("video[autoplay], video[src*='ad']");
        if (adSettings.blockPopups) adSelectors.push("div[role='dialog'], .popup");

        if (adSelectors.length === 0) return;

        const adElements = [...document.querySelectorAll(adSelectors.join(","))].filter(el => el.offsetHeight > 0);
        adElements.forEach(ad => {
            ad.style.display = "none";
            let widget = document.createElement("div");
            widget.innerText = replacementText;
            widget.style = "background: #ffeb3b; color: #333; padding: 10px; font-size: 14px; text-align: center; border-radius: 5px;";
            ad.parentNode?.replaceChild(widget, ad);
        });
    });
}

// Observe DOM changes to remove dynamically loaded ads
function observeDOMChanges() {
    const observer = new MutationObserver(() => replaceAds());
    observer.observe(document.body, { childList: true, subtree: true });
}

observeDOMChanges();
window.addEventListener("load", replaceAds);
