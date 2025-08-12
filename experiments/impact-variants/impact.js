/**
 * Impact Variants Helper Script
 * Triggers visual impact effects precisely at boot→main transition
 */
(function() {
  // Determine which impact variant to use (strobe, letterbox, cut)
  function getImpactVariant() {
    // First check for explicitly set window variable
    if (typeof window.IMPACT === 'string' && 
        ['strobe', 'letterbox', 'cut'].includes(window.IMPACT)) {
      return window.IMPACT;
    }
    
    // Otherwise check URL query param
    const params = new URLSearchParams(window.location.search);
    const paramValue = params.get('impact');
    if (paramValue && ['strobe', 'letterbox', 'cut'].includes(paramValue)) {
      return paramValue;
    }
    
    // Default to strobe if nothing valid found
    return 'strobe';
  }

  // Create and insert variant badge
  function createBadge(variant) {
    const badge = document.createElement('div');
    badge.className = 'impact-badge';
    badge.textContent = `Impact: ${variant}`;
    document.body.appendChild(badge);
  }

  // Apply impact effect class to html
  function setupImpactVariant() {
    const variant = getImpactVariant();
    const html = document.documentElement;
    
    // Add variant class to html element
    html.classList.add(`impact-${variant}`);
    
    // Create identification badge
    createBadge(variant);
    
    return variant;
  }
  
  // Trigger the impact animation
  function triggerImpact() {
    const html = document.documentElement;
    
    // Add impact-run class to trigger animation
    html.classList.add('impact-run');
    
    // Remove impact-run class after animation completes
    setTimeout(() => {
      html.classList.remove('impact-run');
    }, 600);
  }
  
  // Expose force trigger function for testing
  window.forceImpact = triggerImpact;
  
  // Main initialization
  function initImpact() {
    // Setup variant first
    setupImpactVariant();
    
    // Get boot screen element
    const bootScreen = document.getElementById('boot-screen');
    const mainPortfolio = document.getElementById('main-portfolio');
    
    // Fallback: if boot screen not found or main portfolio already visible, trigger immediately
    if (!bootScreen || (mainPortfolio && mainPortfolio.style.display !== 'none')) {
      console.log('Boot animation already complete, triggering impact immediately');
      triggerImpact();
      return;
    }
    
    // If boot screen is transitioning, listen for animation end
    if (bootScreen.classList.contains('transitioning')) {
      bootScreen.addEventListener('animationend', function bootEndHandler() {
        bootScreen.removeEventListener('animationend', bootEndHandler);
        triggerImpact();
      });
      return;
    }
    
    // Otherwise, set up observer to watch for transitioning class
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && 
            mutation.attributeName === 'class' &&
            bootScreen.classList.contains('transitioning')) {
          
          // Once transitioning starts, listen for animation end
          bootScreen.addEventListener('animationend', function bootEndHandler() {
            bootScreen.removeEventListener('animationend', bootEndHandler);
            observer.disconnect();
            triggerImpact();
          });
          
          return;
        }
      }
    });
    
    // Start observing boot-screen for class changes
    observer.observe(bootScreen, { 
      attributes: true,
      attributeFilter: ['class']
    });
    
    // Safety fallback: if after 5s nothing happened, disconnect observer
    setTimeout(() => {
      observer.disconnect();
    }, 5000);
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initImpact);
  } else {
    initImpact();
  }
})();
