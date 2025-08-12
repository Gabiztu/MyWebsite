/**
 * Impact Variants Helper Script
 * Applies visual impact effects during boot→main reveal transition
 * Works alongside impact.css without modifying core files
 */
(function() {
  // Determine which impact variant to use (1-10)
  function getImpactVariant() {
    // First check for explicitly set window variable
    if (typeof window.IMPACT_VARIANT === 'number' && 
        window.IMPACT_VARIANT >= 1 && 
        window.IMPACT_VARIANT <= 10) {
      return Math.floor(window.IMPACT_VARIANT);
    }
    
    // Otherwise check URL query param
    const params = new URLSearchParams(window.location.search);
    const paramValue = parseInt(params.get('impact'), 10);
    if (!isNaN(paramValue) && paramValue >= 1 && paramValue <= 10) {
      return paramValue;
    }
    
    // Default to variant 1 if nothing valid found
    return 1;
  }

  // Create and insert variant badge
  function createBadge(variantNum) {
    const badge = document.createElement('div');
    badge.className = 'impact-badge';
    badge.textContent = `Impact v${variantNum}`;
    document.body.appendChild(badge);
  }

  // Apply impact effect when transition begins
  function applyImpactEffect() {
    const variantNum = getImpactVariant();
    const html = document.documentElement;
    
    // Add variant class to html element
    html.classList.add(`impact-v${variantNum}`);
    
    // Create identification badge
    createBadge(variantNum);
    
    // Set up observer to watch for transition class
    const bootScreen = document.getElementById('boot-screen');
    if (!bootScreen) return;
    
    // Function to trigger impact animation
    function triggerImpact() {
      html.classList.add('impact-run');
      
      // Remove impact-run class after animation completes
      setTimeout(() => {
        html.classList.remove('impact-run');
      }, 600);
    }
    
    // Fail-safe: if already transitioning, trigger immediately
    if (bootScreen.classList.contains('transitioning')) {
      triggerImpact();
      return;
    }
    
    // Set up observer to watch for the transitioning class
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && 
            mutation.attributeName === 'class' &&
            bootScreen.classList.contains('transitioning')) {
          triggerImpact();
          observer.disconnect();
          break;
        }
      }
    });
    
    // Start observing boot-screen for class changes
    observer.observe(bootScreen, { 
      attributes: true,
      attributeFilter: ['class']
    });
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyImpactEffect);
  } else {
    applyImpactEffect();
  }
})();
