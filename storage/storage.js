function saveLink(link, category) {
    chrome.storage.sync.get(['links'], function(result) {
        let links = result.links || [];
        links.push({ link: link, category: category });
        chrome.storage.sync.set({ links: links }, function() {
            console.log('Link saved:', link);
        });
    });
}

function getLinks(callback) {
    chrome.storage.sync.get(['links'], function(result) {
        callback(result.links || []);
    });
}

function clearLinks() {
    chrome.storage.sync.set({ links: [] }, function() {
        console.log('All links cleared');
    });
}