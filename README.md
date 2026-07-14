# Flip Book

An interactive 3D book viewer that renders PDFs, images, or HTML content as a realistic flipping book using Three.js, jQuery, and PDF.js.

## Quick Start (Run Locally)

Choose **any** of the following single commands to run the project locally on any device:

### Option A: Using Node.js (Recommended)
If you have Node.js installed, run:
```bash
npm start
```
*(This starts a local server on http://localhost:8085 with cache disabled)*

### Option B: Using Python
If you have Python installed, run:
```bash
python -m http.server
```
*(This starts a local server on http://localhost:8000)*

### Option C: Using PHP
If you have PHP installed, run:
```bash
php -S localhost:8000
```

***

## How to Publish to the Web (Free)

### 1. GitHub Pages (No setup needed)
Since the project is already on GitHub, you can publish it live in seconds:
1. Go to your repository settings on GitHub.
2. Click on **Pages** in the left sidebar.
3. Under *Build and deployment*, set the Source to **Deploy from a branch**.
4. Select the `main` branch and `/ (root)` folder, then click **Save**.
5. GitHub will give you a live link (e.g., `https://Reinhart-py.github.io/floppyx/`) to view your flip book on any device!

### 2. Drag-and-Drop (Netlify / Vercel)
If you want to host it without using command line:
1. Go to [Netlify Drop](https://app.netlify.com/drop).
2. Drag and drop this folder directly into the browser.
3. Netlify will instantly give you a live public link.

### 3. Cloudflare Pages
To publish for free using Cloudflare Pages:
1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Navigate to **Workers & Pages** in the left menu, then click **Create Application**.
3. Go to the **Pages** tab and click **Connect to Git**.
4. Log in to your GitHub account and select the `floppyx` repository.
5. In the *Set up builds and deployments* settings:
   - **Framework preset**: None
   - **Build command**: (Leave empty)
   - **Build output directory**: (Leave empty or set to `/`)
6. Click **Save and Deploy**. Cloudflare will automatically build and publish your flip book every time you push changes to GitHub!

***

## Customization

You can fully customize the digital reader's PDF, page-flipping sounds, and floating redirect buttons using two files:

### 1. Main Configuration (`config.js`)
Open `config.js` in the root folder to edit general flipbook options:

```javascript
window.FLIPBOOK_CONFIG = {
  // 1. Path to your PDF file (placed in assets/ folder)
  pdfUrl: 'assets/simple.pdf',
  
  // 2. Animation style: '3d' (realistic magazine) or '2d' (HTML5 flat turn)
  animationStyle: '3d',
  
  // 3. Page flipping sound effect files
  sounds: {
    startFlip: 'sounds/start-flip.mp3',
    endFlip: 'sounds/end-flip.mp3'
  }
};
```

---

### 2. Floating Buttons Configuration (`buttons-config.json`)
Open `buttons-config.json` in the root folder to add, change, or remove the round floating action buttons stacked in the bottom-right corner of the page:

```json
[
  {
    "enabled": true,
    "imageUrl": "",
    "redirectUrl": "https://wa.me/1234567890",
    "target": "_blank"
  },
  {
    "enabled": true,
    "imageUrl": "",
    "redirectUrl": "https://google.com",
    "target": "_blank"
  }
]
```

#### Settings Details:
* **`enabled`**: Set to `true` to show the button, or `false` to hide it.
* **`imageUrl`**: URL or local path to a custom icon image (e.g. `images/my-logo.png`).
  * *Tip: If you leave `imageUrl` blank (`""`), the application will auto-detect the URL (e.g. WhatsApp, Facebook, X/Twitter, Instagram, Email, or Phone) and automatically render the official brand SVG icon with its matching colors and pulsing effects!*
* **`redirectUrl`**: The link target destination when clicked (e.g. WhatsApp chat link, your company homepage, email address with `mailto:`, etc.).
* **`target`**: Set to `"_blank"` to open in a new tab, or `"_self"` to open in the current tab.


## License

GPL-2.0 License.
