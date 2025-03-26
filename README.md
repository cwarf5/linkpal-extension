# LinkPal Extension

LinkPal is a Chrome extension that allows users to save links, categorize them, and access them later. This project aims to provide a simple and efficient way to manage your favorite links directly from your browser.


![2GwHLRsM8n](https://github.com/user-attachments/assets/11e50324-317e-4a96-9a70-7f63ecbdf7aa)
![Q0iuKdH0cv](https://github.com/user-attachments/assets/78819952-e4ca-4a58-ae71-713330904055)


## Features

- Save links from any webpage.
- Categorize saved links for easy access.
- View and manage saved links through a user-friendly popup interface.

## Planned Features
- **Sync** to and from a GitHub repo
  - Allows you to store the .JSON of your links in a private GitHub repo and sync accross devices, or view directly from GitHub.
- Add a brief note to each saved link.
  - So you can remember why you saved it...

## Project Structure

```
linkpal-extension
├── manifest.json         # Configuration file for the Chrome extension
├── background.js         # Background script for handling events
├── popup                 # Popup interface files
│   ├── popup.html        # HTML structure for the popup
│   ├── popup.js          # JavaScript logic for the popup
│   └── popup.css         # Styles for the popup
├── content               # Content scripts
│   └── content.js        # Script for interacting with web pages
├── icons                 # Extension icons
│   ├── icon16.png        # 16x16 pixel icon
│   ├── icon48.png        # 48x48 pixel icon
│   └── icon128.png       # 128x128 pixel icon
├── storage               # Storage management
│   └── storage.js        # Functions for managing saved links
├── utils                 # Utility functions
│   └── helpers.js        # Helper functions for the extension
└── README.md             # Documentation for the project
```

## Installation

1. Clone the repository or download the source code.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" in the top right corner.
4. Click on "Load unpacked" and select the `linkpal-extension` directory.

## Usage

1. Click on the LinkPal extension icon in the Chrome toolbar.
2. Use the popup interface to save links and categorize them.
3. Access your saved links anytime through the popup.

## Why not normal browser bookmarks?
I use different browsers between many different devices and operating systems. This is a one-place-fits-all solution. There will be a ported FireFox extension to allow capatability there. Additionally, all my links will be stored in a GitHub repo, so I can access from any device, anywhere, whenever... *and I just wanted to take a stab at developing a Chrome extension* 

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## Privacy
This extension only stores your data locally. This is open source, check the code if you're worried about it..

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
