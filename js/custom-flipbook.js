$(document).ready(function() {
  const pdfUrl = window.FLIPBOOK_CONFIG.pdfUrl || 'assets/simple.pdf';
  const animationStyle = window.FLIPBOOK_CONFIG.animationStyle || '3d'; // '3d' or '2d'
  
  const $viewport = $('#viewport');
  const $book3d = $('#book-3d');
  const $book2d = $('#book-2d');
  const $loader = $('#loader');
  const $activeBook = (animationStyle === '2d') ? $book2d : $book3d;
  
  let pdfDoc = null;
  let pageCount = 0;
  let pageFlip = null; // StPageFlip instance
  let isZoomed = false;
  let zoomScale = 1;
  let bookWidth = 1000;  // Double-page width
  let bookHeight = 700; // Page height
  let isHardPage = false; // Toggle page folding mode
  
  // Configure PDF.js worker
  const pdfjsLib = window['pdfjs-dist/build/pdf'];
  if (!pdfjsLib) {
    console.error("PDF.js library not loaded.");
    return;
  }
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'js/pdf.worker.js';
  
  // Load PDF document
  pdfjsLib.getDocument(pdfUrl).promise.then(function(pdf) {
    pdfDoc = pdf;
    pageCount = pdf.numPages;
    
    if (animationStyle === '2d') {
      initBook2D();
    } else {
      initBook3D(0);
      createDensityToggle();
    }
    setupParallax();
  }).catch(function(error) {
    console.error("Error loading PDF: ", error);
    $loader.find('span').text("Error loading PDF document.");
  });

  // Render utility (renders page to canvas asynchronously)
  function renderPage(pageNum, $pageContainer) {
    return pdfDoc.getPage(pageNum).then(function(page) {
      const viewport = page.getViewport({ scale: 2.0 });
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      
      $pageContainer.prepend(canvas);
      
      const renderContext = {
        canvasContext: ctx,
        viewport: viewport
      };
      return page.render(renderContext).promise;
    });
  }

  // 1. STPAGEFLIP 3D ENGINE
  async function initBook3D(initialPage = 0) {
    $book3d.empty();
    
    // Create pages dynamically
    for (let p = 1; p <= pageCount; p++) {
      const $page = $('<div class="st-page"></div>').attr('data-page-number', p);
      if (isHardPage) {
        $page.attr('data-density', 'hard');
      } else {
        $page.attr('data-density', 'soft');
      }
      $book3d.append($page);
    }
    
    // Render all pages first
    const renderPromises = [];
    $book3d.find('.st-page').each(function() {
      const p = parseInt($(this).attr('data-page-number'));
      renderPromises.push(renderPage(p, $(this)));
    });
    
    await Promise.all(renderPromises);
    
    // Initialize StPageFlip
    pageFlip = new St.PageFlip(document.getElementById('book-3d'), {
      width: 500,
      height: 700,
      size: "stretch",
      minWidth: 300,
      maxWidth: 1000,
      minHeight: 400,
      maxHeight: 1400,
      drawShadow: true,
      showCover: true,
      usePortrait: true
    });
    
    pageFlip.loadFromHTML(document.querySelectorAll('.st-page'));
    
    if (initialPage > 0) {
      pageFlip.turnToPage(initialPage);
    }
    
    // Trigger on flip event
    pageFlip.on('flip', function(e) {
      updatePageNumberDisplay3D(e.data);
    });
    
    $loader.fadeOut(300, function() {
      $book3d.fadeIn(300);
      updateScale();
    });
    
    if ($('.nav-controls').length === 0) {
      createControls();
    }
    setupEvents3D();
  }

  // 2. TURN.JS 2D ENGINE
  async function initBook2D() {
    $book2d.empty();
    
    for (let p = 1; p <= pageCount; p++) {
      const $page = $('<div class="page-2d"></div>').attr('data-page-number', p);
      $book2d.append($page);
      await renderPage(p, $page);
    }
    
    $book2d.turn({
      width: bookWidth,
      height: bookHeight,
      autoCenter: true,
      display: 'double',
      acceleration: true,
      elevation: 50,
      gradients: true,
      when: {
        turning: function(event, page) {
          updatePageNumberDisplay2D(page);
        }
      }
    });

    $loader.fadeOut(300, function() {
      $book2d.fadeIn(300);
      updateScale();
    });
    
    if ($('.nav-controls').length === 0) {
      createControls();
    }
    setupEvents2D();
  }

  // Scaling handler (keeps book correctly proportioned and centered)
  function updateScale() {
    if (isZoomed) return;
    
    const viewportWidth = $viewport.width();
    const viewportHeight = $viewport.height();
    const scaleX = (viewportWidth * 0.9) / bookWidth;
    const scaleY = (viewportHeight * 0.9) / bookHeight;
    const scale = Math.min(scaleX, scaleY, 1.2);
    
    $activeBook.css({
      'transform': `scale(${scale})`,
      'left': '0',
      'top': '0'
    });
  }

  // Overlay Controls
  function createControls() {
    const $controls = $(`
      <div class="nav-controls">
        <button class="nav-btn" id="btn-prev" title="Previous page">◀</button>
        <div class="page-num" id="page-display">Cover / 1</div>
        <button class="nav-btn" id="btn-next" title="Next page">▶</button>
        <button class="nav-btn" id="btn-zoom" title="Toggle zoom">🔍</button>
      </div>
    `);
    $viewport.append($controls);
    
    $('#btn-prev').on('click', function(e) {
      e.stopPropagation();
      if (animationStyle === '2d') {
        $book2d.turn('previous');
      } else {
        pageFlip.flipPrev();
      }
    });
    
    $('#btn-next').on('click', function(e) {
      e.stopPropagation();
      if (animationStyle === '2d') {
        $book2d.turn('next');
      } else {
        pageFlip.flipNext();
      }
    });
    
    $('#btn-zoom').on('click', function(e) {
      e.stopPropagation();
      toggleZoom();
    });
  }

  // Page density toggle (Hard / Soft cover mode)
  function createDensityToggle() {
    if ($('.density-toggle').length > 0) return;
    
    const $toggleBtn = $(`
      <div class="density-toggle" title="Toggle Hard/Soft Page folding">
        <svg viewBox="0 0 24 24" id="density-icon">
          <path d="M21 4H3c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM3 19V6h8v13H3zm18 0h-8V6h8v13z"/>
        </svg>
      </div>
    `);
    
    $viewport.append($toggleBtn);
    
    $toggleBtn.on('click', function() {
      if (animationStyle === '2d') return;
      isHardPage = !isHardPage;
      
      // Update SVG icon path based on state
      if (isHardPage) {
        // Hardcover book icon representation
        $('#density-icon').html('<path d="M19 2H5c-1.11 0-2 .9-2 2v16c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-5 18H5V4h9v16zm5 0h-3V4h3v16z"/>');
      } else {
        // Flexible curling pages icon representation
        $('#density-icon').html('<path d="M21 4H3c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM3 19V6h8v13H3zm18 0h-8V6h8v13z"/>');
      }
      
      // Rebuild StPageFlip preserving current page index
      if (pageFlip) {
        const currentPage = pageFlip.getCurrentPageIndex();
        pageFlip.destroy();
        $book3d.hide();
        $loader.show();
        initBook3D(currentPage);
      }
    });
  }

  // Tilt parallax effect
  function setupParallax() {
    $viewport.on('mousemove', function(e) {
      if (isZoomed) return;
      
      const width = $viewport.width();
      const height = $viewport.height();
      const mouseX = e.clientX - (width / 2);
      const mouseY = e.clientY - (height / 2);
      
      // Smooth tilt values (max 5deg)
      const tiltX = (mouseY / (height / 2)) * -5;
      const tiltY = (mouseX / (width / 2)) * 5;
      
      const scaleX = (width * 0.9) / bookWidth;
      const scaleY = (height * 0.9) / bookHeight;
      const baseScale = Math.min(scaleX, scaleY, 1.2);
      
      $activeBook.css({
        'transform': `scale(${baseScale}) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
        'transition': 'transform 0.1s ease-out'
      });
      
      // Shift background linear-gradient slowly
      const bgShiftX = (mouseX / (width / 2)) * -15;
      const bgShiftY = (mouseY / (height / 2)) * -15;
      $viewport.css('background-position', `calc(50% + ${bgShiftX}px) calc(50% + ${bgShiftY}px)`);
    });
    
    $viewport.on('mouseleave', function() {
      if (isZoomed) return;
      
      const width = $viewport.width();
      const height = $viewport.height();
      const scaleX = (width * 0.9) / bookWidth;
      const scaleY = (height * 0.9) / bookHeight;
      const baseScale = Math.min(scaleX, scaleY, 1.2);
      
      $activeBook.css({
        'transform': `scale(${baseScale}) rotateX(0deg) rotateY(0deg)`,
        'transition': 'transform 0.5s ease-out'
      });
      $viewport.css('background-position', '50% 50%');
    });
  }

  function updatePageNumberDisplay3D(pageIndex) {
    const $display = $('#page-display');
    if (!$display.length) return;
    
    if (pageIndex === 0) {
      $display.text(`Cover / ${pageCount}`);
    } else {
      const leftPage = pageIndex;
      const rightPage = pageIndex + 1;
      const displayStr = (rightPage <= pageCount) ? `${leftPage} - ${rightPage}` : `${leftPage}`;
      $display.text(`${displayStr} / ${pageCount}`);
    }
  }

  function updatePageNumberDisplay2D(pageIndex) {
    const $display = $('#page-display');
    if (!$display.length) return;
    
    let displayStr = '';
    if (pageIndex === 1) {
      displayStr = 'Cover';
    } else {
      const view = $book2d.turn('view', pageIndex);
      if (view[0] && view[1]) {
        displayStr = `${view[0]} - ${view[1]}`;
      } else {
        displayStr = `${view[0] || view[1]}`;
      }
    }
    $display.text(`${displayStr} / ${pageCount}`);
  }

  function toggleZoom() {
    isZoomed = !isZoomed;
    if (isZoomed) {
      zoomScale = 1.6;
      $activeBook.css({
        'transform': `scale(${zoomScale})`,
        'cursor': 'grab'
      });
    } else {
      zoomScale = 1;
      updateScale();
      $activeBook.css({
        'cursor': 'default',
        'left': '0',
        'top': '0'
      });
    }
  }

  // 3D Event Handlers
  function setupEvents3D() {
    $(window).off('resize', updateScale).on('resize', updateScale);
    $(document).off('keydown').on('keydown', function(e) {
      if (e.key === 'ArrowLeft') {
        pageFlip.flipPrev();
      } else if (e.key === 'ArrowRight') {
        pageFlip.flipNext();
      } else if (e.key === 'Escape' && isZoomed) {
        toggleZoom();
      }
    });

    let startX = 0, startY = 0, isDragging = false, bookLeft = 0, bookTop = 0;
    $viewport.off('touchstart mousedown').on('touchstart mousedown', function(e) {
      if ($(e.target).closest('.nav-controls, .density-toggle').length) return;
      const clientX = e.clientX || (e.originalEvent.touches && e.originalEvent.touches[0].clientX);
      const clientY = e.clientY || (e.originalEvent.touches && e.originalEvent.touches[0].clientY);
      if (clientX === undefined) return;
      startX = clientX;
      startY = clientY;
      isDragging = true;
      if (isZoomed) {
        const pos = $book3d.position();
        bookLeft = pos.left;
        bookTop = pos.top;
        $book3d.css('cursor', 'grabbing');
      }
    });

    $(document).off('touchmove mousemove').on('touchmove mousemove', function(e) {
      if (!isDragging) return;
      const clientX = e.clientX || (e.originalEvent.touches && e.originalEvent.touches[0].clientX);
      const clientY = e.clientY || (e.originalEvent.touches && e.originalEvent.touches[0].clientY);
      if (clientX === undefined) return;
      const deltaX = clientX - startX;
      const deltaY = clientY - startY;
      if (isZoomed) {
        $book3d.css({ 'left': `${bookLeft + deltaX}px`, 'top': `${bookTop + deltaY}px` });
      }
    });

    $(document).off('touchend mouseup').on('touchend mouseup', function() {
      if (!isDragging) return;
      isDragging = false;
      $book3d.css('cursor', isZoomed ? 'grab' : 'default');
    });

    $viewport.off('dblclick').on('dblclick', toggleZoom);
    $viewport.off('wheel').on('wheel', function(e) {
      e.preventDefault();
      if (e.originalEvent.deltaY < 0) { if (!isZoomed) toggleZoom(); }
      else { if (isZoomed) toggleZoom(); }
    });
  }

  // 2D Event Handlers
  function setupEvents2D() {
    $(window).off('resize', updateScale).on('resize', updateScale);
    $(document).off('keydown').on('keydown', function(e) {
      if (e.key === 'ArrowLeft') {
        $book2d.turn('previous');
      } else if (e.key === 'ArrowRight') {
        $book2d.turn('next');
      } else if (e.key === 'Escape' && isZoomed) {
        toggleZoom();
      }
    });

    let startX = 0, startY = 0, isDragging = false, bookLeft = 0, bookTop = 0;
    $viewport.off('touchstart mousedown').on('touchstart mousedown', function(e) {
      if ($(e.target).closest('.nav-controls').length) return;
      const clientX = e.clientX || (e.originalEvent.touches && e.originalEvent.touches[0].clientX);
      const clientY = e.clientY || (e.originalEvent.touches && e.originalEvent.touches[0].clientY);
      if (clientX === undefined) return;
      startX = clientX;
      startY = clientY;
      isDragging = true;
      if (isZoomed) {
        const pos = $book2d.position();
        bookLeft = pos.left;
        bookTop = pos.top;
        $book2d.css('cursor', 'grabbing');
      }
    });

    $(document).off('touchmove mousemove').on('touchmove mousemove', function(e) {
      if (!isDragging) return;
      const clientX = e.clientX || (e.originalEvent.touches && e.originalEvent.touches[0].clientX);
      const clientY = e.clientY || (e.originalEvent.touches && e.originalEvent.touches[0].clientY);
      if (clientX === undefined) return;
      const deltaX = clientX - startX;
      const deltaY = clientY - startY;
      if (isZoomed) {
        $book2d.css({ 'left': `${bookLeft + deltaX}px`, 'top': `${bookTop + deltaY}px` });
      }
    });

    $(document).off('touchend mouseup').on('touchend mouseup', function(e) {
      if (!isDragging) return;
      isDragging = false;
      $book2d.css('cursor', isZoomed ? 'grab' : 'default');
      const clientX = e.clientX || (e.originalEvent.changedTouches && e.originalEvent.changedTouches[0].clientX);
      if (clientX === undefined) return;
      const deltaX = clientX - startX;
      if (!isZoomed && Math.abs(deltaX) > 60) {
        if (deltaX > 0) {
          $book2d.turn('previous');
        } else {
          $book2d.turn('next');
        }
      }
    });

    $viewport.off('dblclick').on('dblclick', toggleZoom);
    $viewport.off('wheel').on('wheel', function(e) {
      e.preventDefault();
      if (e.originalEvent.deltaY < 0) { if (!isZoomed) toggleZoom(); }
      else { if (isZoomed) toggleZoom(); }
    });
  }
});
