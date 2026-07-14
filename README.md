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

***

## Customization

To view a different PDF:
1. Place your PDF in the `assets/` folder.
2. Open `config.js` and change the `pdfUrl` path:
   ```javascript
   window.FLIPBOOK_CONFIG = {
     pdfUrl: 'assets/your-new-file.pdf',
     animationStyle: '3d'
   };
   ```

## License

GPL-2.0 License.
