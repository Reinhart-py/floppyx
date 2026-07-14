window.FLIPBOOK_CONFIG = {
  // Path to the PDF or image folder
  pdfUrl: 'assets/simple.pdf',
  
  // Animation style: '3d' for our original magazine style, or '2d' for HTML5 turn.js style
  animationStyle: '3d',
  
  // Example for images sequence (null/omit if using PDF):
  // images: [
  //   'assets/pages/page1.jpg',
  //   'assets/pages/page2.jpg'
  // ]

  // Flipbook turn/flip sounds
  sounds: {
    startFlip: 'sounds/start-flip.mp3',
    endFlip: 'sounds/end-flip.mp3'
  },

  // Floating action buttons config (supports multiple buttons stacked vertically)
  floatingButtons: [
    {
      enabled: true,
      imageUrl: '', // Optional: Custom image URL (e.g., 'assets/custom.png'). Leave blank to auto-detect SVG icon based on URL
      redirectUrl: 'https://wa.me/1234567890', // Redirect URL (e.g., WhatsApp chat link)
      target: '_blank'
    },
    {
      enabled: true,
      imageUrl: '', // Optional: Custom image URL. Leave blank to auto-detect SVG icon
      redirectUrl: 'https://google.com', // Company website link
      target: '_blank'
    }
  ]
};
