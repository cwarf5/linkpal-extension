function formatLink(link) {
    try {
        const url = new URL(link);
        return url.href;
    } catch (error) {
        console.error("Invalid URL format:", link);
        return null;
    }
}

function validateCategory(category) {
    const validCategories = ["Work", "Personal", "Research", "Other"];
    return validCategories.includes(category);
}

function generateUniqueId() {
    return 'link-' + Math.random().toString(36).substr(2, 9);
}