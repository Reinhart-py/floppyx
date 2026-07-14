# Flip Book

An interactive 3D book viewer that renders PDFs, images, or HTML content as a realistic flipping book using Three.js, jQuery, and PDF.js.

## Features

* **3D Animation**: Physics-based paper deformation, page thickness, and curling effects.
* **Format Support**: Direct rendering of PDF files, images, or interactive HTML sheets.
* **Responsive Layout**: Adjusts automatically to match the size of its parent container.
* **Control Overlay**: Zoom, fullscreen, page navigation, table of contents, and printing tools.
* **Single-page & Double-page Modes**: Support for standard and mobile display layouts.

## Getting Started

### Dependencies

Include the following libraries in your HTML page:
- jQuery
- Three.js
- HTML2Canvas (optional, for HTML page rendering)
- PDF.js (for PDF rendering)

### Usage

Initialize the viewer on any target container:

```javascript
$('#book-container').FlipBook({
  pdf: 'assets/simple.pdf',
  template: {
    html: 'templates/default-book-view.html',
    styles: [
      'css/font-awesome.min.css',
      'css/short-black-book-view.css'
    ],
    links: [
      {
        rel: 'stylesheet',
        href: 'css/font-awesome.min.css'
      }
    ],
    script: 'js/default-book-view.js'
  }
});
```

## Customization

UI layout and styles can be modified via:
- `templates/default-book-view.html`: Defines the toolbar and overlays.
- `css/short-black-book-view.css`: Styling for the toolbar, buttons, and navigation panel.
- `js/default-book-view.js`: Handles basic UI behaviors like dropdown menus and centering.

## License

GPL-2.0 License.
