// This file contains the background script for the extension. It handles events such as saving links and managing the extension's lifecycle.

chrome.runtime.onInstalled.addListener(() => {
    console.log("Link Basin extension installed.");
    
    // Initialize default categories
    chrome.storage.sync.get(["categories"], function(result) {
        if (!result.categories) {
            chrome.storage.sync.set({
                categories: ["Work", "Personal", "Research", "Other"]
            });
        }
    });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "saveLink") {
        saveLink(request.link, request.category);
        sendResponse({status: "success"});
    }
    return true;
});

function saveLink(link, category) {
    chrome.storage.sync.get(["savedLinks"], (result) => {
        let savedLinks = result.savedLinks || [];
        savedLinks.push({
            id: generateUniqueId(),
            link: link, 
            category: category,
            dateAdded: new Date().toISOString()
        });
        chrome.storage.sync.set({savedLinks: savedLinks}, () => {
            console.log("Link saved:", link, "Category:", category);
        });
    });
}

// Generate a unique ID for links
function generateUniqueId() {
    return 'link-' + Math.random().toString(36).substr(2, 9);
}