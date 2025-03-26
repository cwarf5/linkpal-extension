document.addEventListener('DOMContentLoaded', function() {
    // UI Elements
    const capturePageButton = document.getElementById('capturePageButton');
    const captureSelectionButton = document.getElementById('captureSelectionButton');
    const linkInput = document.getElementById('linkInput');
    const categorySelect = document.getElementById('categorySelect');
    const newCategoryInput = document.getElementById('newCategoryInput');
    const addCategoryButton = document.getElementById('addCategoryButton');
    const saveButton = document.getElementById('saveButton');
    const viewLinksButton = document.getElementById('viewLinksButton');
    const backButton = document.getElementById('backButton');
    const messageDiv = document.getElementById('message');
    const savedLinksContainer = document.getElementById('savedLinksContainer');
    const linksList = document.getElementById('linksList');
    const filterCategory = document.getElementById('filterCategory');
    const mainContent = document.getElementById('mainContent');

    // Load saved categories
    loadCategories();

    // Capture current page URL
    capturePageButton.addEventListener('click', function() {
        resetButtonStates();
        this.classList.add('primary', 'ring-2', 'ring-primary');
        captureSelectionButton.classList.remove('primary', 'ring-2', 'ring-primary');
        captureSelectionButton.classList.add('secondary');
        
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            linkInput.value = tabs[0].url;
        });
    });

    // Capture selected text as link
    captureSelectionButton.addEventListener('click', function() {
        resetButtonStates();
        this.classList.add('primary', 'ring-2', 'ring-primary');
        capturePageButton.classList.remove('primary', 'ring-2', 'ring-primary');
        capturePageButton.classList.add('secondary');
        
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: getSelection
            }, function(results) {
                if (results && results[0] && results[0].result) {
                    linkInput.value = results[0].result;
                } else {
                    showMessage("No text selected", "error");
                }
            });
        });
    });

    // Reset button states
    function resetButtonStates() {
        capturePageButton.className = 'secondary';
        captureSelectionButton.className = 'secondary';
    }

    // Add new category
    addCategoryButton.addEventListener('click', function() {
        const newCategory = newCategoryInput.value.trim();
        if (newCategory) {
            addCategory(newCategory);
            newCategoryInput.value = '';
        } else {
            showMessage("Please enter a category name", "error");
        }
    });

    // New category on Enter
    newCategoryInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addCategoryButton.click();
        }
    });

    // Save link
    saveButton.addEventListener('click', function() {
        const link = linkInput.value;
        const category = categorySelect.value;

        if (link && category) {
            saveLink(link, category);
        } else {
            showMessage("Please select both a link and a category", "error");
        }
    });

    // View saved links
    viewLinksButton.addEventListener('click', function() {
        mainContent.classList.add('hidden');
        savedLinksContainer.classList.remove('hidden');
        loadSavedLinks();
    });

    // Back button
    backButton.addEventListener('click', function() {
        savedLinksContainer.classList.add('hidden');
        mainContent.classList.remove('hidden');
    });

    // Filter category change
    filterCategory.addEventListener('change', function() {
        loadSavedLinks(this.value);
    });

    // Auto-capture current page URL when popup opens
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        linkInput.value = tabs[0].url;
        resetButtonStates();
        capturePageButton.classList.add('primary', 'ring-2', 'ring-primary');
    });

    // Helper function to get selection - this will be executed in the context of the page
    function getSelection() {
        return window.getSelection().toString();
    }

    // Helper function to save a link
    function saveLink(link, category) {
        chrome.storage.sync.get(["savedLinks"], function(result) {
            let savedLinks = result.savedLinks || [];
            
            // Add the new link
            savedLinks.push({
                id: 'link-' + Date.now(),
                link: link,
                category: category,
                dateAdded: new Date().toISOString()
            });
            
            // Save to storage
            chrome.storage.sync.set({savedLinks: savedLinks}, function() {
                showMessage("Link saved successfully!", "success");
                linkInput.value = '';
                categorySelect.selectedIndex = 0;
                resetButtonStates();
                capturePageButton.classList.add('ring-2', 'ring-primary');
                
                // Reload the current page URL after saving
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    linkInput.value = tabs[0].url;
                });
            });
        });
    }

    // Helper functions
    function loadCategories() {
        chrome.storage.sync.get(["categories"], function(result) {
            const categories = result.categories || ["Work", "Personal", "Research", "Other"];
            
            // Save default categories if none exist
            if (!result.categories) {
                chrome.storage.sync.set({categories: categories});
            }
            
            // Populate dropdowns
            populateCategoryDropdown(categorySelect, categories, true);
            populateCategoryDropdown(filterCategory, categories, false, true);
        });
    }

    function addCategory(category) {
        chrome.storage.sync.get(["categories"], function(result) {
            let categories = result.categories || [];
            
            // Check if category already exists
            if (!categories.includes(category)) {
                categories.push(category);
                chrome.storage.sync.set({categories: categories}, function() {
                    populateCategoryDropdown(categorySelect, categories, true);
                    populateCategoryDropdown(filterCategory, categories, false, true);
                    showMessage("Category added!", "success");
                    
                    // Select the newly added category
                    categorySelect.value = category;
                });
            } else {
                showMessage("Category already exists", "error");
            }
        });
    }

    function populateCategoryDropdown(selectElement, categories, hasPlaceholder, addAllOption) {
        // Clear existing options except the first one for filter dropdown
        if (selectElement === filterCategory) {
            while (selectElement.options.length > 1) {
                selectElement.remove(1);
            }
        } else {
            // Clear all options for category select
            while (selectElement.options.length > 0) {
                selectElement.remove(0);
            }
            
            // Add placeholder if needed
            if (hasPlaceholder) {
                const placeholderOption = document.createElement('option');
                placeholderOption.value = '';
                placeholderOption.textContent = 'Select Category';
                placeholderOption.disabled = true;
                placeholderOption.selected = true;
                selectElement.appendChild(placeholderOption);
            }
        }
        
        // Add "All Categories" option for filter if not already present
        if (addAllOption && selectElement.options.length === 0) {
            const allOption = document.createElement('option');
            allOption.value = 'all';
            allOption.textContent = 'All Categories';
            selectElement.appendChild(allOption);
        }
        
        // Add categories to dropdown
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            selectElement.appendChild(option);
        });
    }

    function loadSavedLinks(filterValue = 'all') {
        chrome.storage.sync.get(["savedLinks"], function(result) {
            linksList.innerHTML = '';
            const savedLinks = result.savedLinks || [];
            
            if (savedLinks.length === 0) {
                displayEmptyState("No saved links found");
                return;
            }
            
            const filteredLinks = filterValue === 'all' 
                ? savedLinks 
                : savedLinks.filter(link => link.category === filterValue);
                
            if (filteredLinks.length === 0) {
                displayEmptyState("No links in this category");
                return;
            }
            
            // Sort links by date added (most recent first)
            filteredLinks.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
            
            filteredLinks.forEach(link => {
                const linkElement = createLinkElement(link);
                linksList.appendChild(linkElement);
            });
        });
    }

    function displayEmptyState(message) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.innerHTML = `<p>${message}</p>`;
        linksList.appendChild(emptyState);
    }

    function createLinkElement(link) {
        const linkItem = document.createElement('div');
        linkItem.className = 'link-item';
        linkItem.dataset.id = link.id;
        
        // Create link - handle URLs and text differently
        const linkContent = document.createElement('div');
        linkContent.style.marginBottom = '0.5rem';
        
        const linkText = document.createElement('a');
        if (link.link.startsWith('http://') || link.link.startsWith('https://')) {
            linkText.href = link.link;
            linkText.target = '_blank';
        } else {
            linkText.href = '#';
            linkText.style.color = '#333';
        }
        linkText.textContent = truncateText(link.link, 60);
        linkText.title = link.link;
        
        // Create metadata container
        const metaContainer = document.createElement('div');
        metaContainer.style.display = 'flex';
        metaContainer.style.alignItems = 'center';
        metaContainer.style.gap = '0.5rem';
        metaContainer.style.marginTop = '0.5rem';
        
        // Create category badge
        const categoryText = document.createElement('div');
        categoryText.className = 'badge';
        categoryText.textContent = link.category;
        
        // Create date label
        const dateText = document.createElement('div');
        dateText.className = 'link-date';
        const date = new Date(link.dateAdded);
        dateText.textContent = formatDate(date);
        
        // Create actions container
        const actions = document.createElement('div');
        actions.className = 'link-actions';
        
        // Create copy button for non-URL links
        if (!(link.link.startsWith('http://') || link.link.startsWith('https://'))) {
            const copyBtn = document.createElement('button');
            copyBtn.textContent = 'Copy';
            copyBtn.className = 'secondary';
            copyBtn.style.height = '2rem';
            copyBtn.style.padding = '0 0.75rem';
            copyBtn.style.fontSize = '0.75rem';
            copyBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                navigator.clipboard.writeText(link.link);
                showMessage("Copied to clipboard!", "success");
            });
            actions.appendChild(copyBtn);
        }
        
        // Create delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'destructive';
        deleteBtn.style.height = '2rem';
        deleteBtn.style.padding = '0 0.75rem';
        deleteBtn.style.fontSize = '0.75rem';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            deleteLink(link.id);
        });
        
        // Add elements to link item
        linkContent.appendChild(linkText);
        metaContainer.appendChild(categoryText);
        metaContainer.appendChild(dateText);
        actions.appendChild(deleteBtn);
        
        linkItem.appendChild(linkContent);
        linkItem.appendChild(metaContainer);
        linkItem.appendChild(actions);
        
        return linkItem;
    }

    function truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    function formatDate(date) {
        const now = new Date();
        const diff = now - date;
        
        // Less than 24 hours ago
        if (diff < 86400000) {
            if (diff < 3600000) {
                // Less than 1 hour ago
                const minutes = Math.floor(diff / 60000);
                return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
            } else {
                // Hours ago
                const hours = Math.floor(diff / 3600000);
                return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
            }
        }
        
        // Less than 7 days ago
        if (diff < 604800000) {
            const days = Math.floor(diff / 86400000);
            return `${days} ${days === 1 ? 'day' : 'days'} ago`;
        }
        
        // Format as date
        return date.toLocaleDateString();
    }

    function deleteLink(linkId) {
        chrome.storage.sync.get(["savedLinks"], function(result) {
            let savedLinks = result.savedLinks || [];
            const newLinks = savedLinks.filter(link => link.id !== linkId);
            
            chrome.storage.sync.set({savedLinks: newLinks}, function() {
                loadSavedLinks(filterCategory.value);
                showMessage("Link deleted!", "success");
            });
        });
    }

    function showMessage(message, type) {
        messageDiv.textContent = message;
        messageDiv.className = type;
        messageDiv.classList.remove('hidden');
        
        // Clear message after 3 seconds
        setTimeout(() => {
            messageDiv.classList.add('hidden');
        }, 3000);
    }
});