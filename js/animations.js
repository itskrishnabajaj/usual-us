// ============================================
// Animations & Gesture Integration
// ============================================
// Uses GSAP for high-performance animations,
// Lenis for smooth momentum scrolling,
// Hammer.js for gesture handling.
// All integrations are safe — gracefully degrade if libs are missing.

// ---- Smooth Scrolling (Lenis) ----

let lenisInstance = null;

function initSmoothScroll() {
    if (typeof Lenis === 'undefined') return;
    try {
        lenisInstance = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            touchMultiplier: 1.8,
        });

        function raf(time) {
            lenisInstance.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    } catch (e) {
        console.warn('⚠️ Lenis init failed:', e);
    }
}

// ---- GSAP Animation Helpers ----

/**
 * Animate a modal opening with GSAP. Falls back to CSS if GSAP unavailable.
 * @param {HTMLElement} el - The modal element to animate
 */
function animateModalIn(el) {
    if (!el) return;
    if (typeof gsap === 'undefined') return; // CSS handles it

    gsap.fromTo(el, {
        opacity: 0,
        scale: 0.92,
        y: 30,
    }, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.35,
        ease: 'power3.out',
    });
}

/**
 * Animate a modal closing with GSAP.
 * @param {HTMLElement} el - The modal element to animate
 * @param {Function} [onComplete] - Callback when animation finishes
 */
function animateModalOut(el, onComplete) {
    if (!el) return;
    if (typeof gsap === 'undefined') {
        if (onComplete) onComplete();
        return;
    }

    gsap.to(el, {
        opacity: 0,
        scale: 0.92,
        y: 20,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: onComplete,
    });
}

/**
 * Stagger-animate a list of cards/items entering the view.
 * @param {string} selector - CSS selector for the items to animate
 * @param {HTMLElement} [parent] - Optional parent to scope the query
 */
function animateCardsIn(selector, parent) {
    if (typeof gsap === 'undefined') return;
    const scope = parent || document;
    const items = scope.querySelectorAll(selector);
    if (!items.length) return;

    gsap.fromTo(items, {
        opacity: 0,
        y: 24,
    }, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.06,
        ease: 'power2.out',
    });
}

/**
 * Animate tab content transition with GSAP.
 * @param {HTMLElement} outEl - The current tab element (fading out)
 * @param {HTMLElement} inEl  - The new tab element (fading in)
 * @param {Function} [onSwap] - Called when outEl finishes and inEl should become active
 */
function animateTabSwitch(outEl, inEl, onSwap) {
    if (typeof gsap === 'undefined') {
        if (onSwap) onSwap();
        return;
    }

    const tl = gsap.timeline();

    if (outEl) {
        tl.to(outEl, {
            opacity: 0,
            y: -8,
            duration: 0.15,
            ease: 'power2.in',
        });
    }

    tl.call(() => {
        if (onSwap) onSwap();
    });

    if (inEl) {
        tl.fromTo(inEl, {
            opacity: 0,
            y: 8,
        }, {
            opacity: 1,
            y: 0,
            duration: 0.25,
            ease: 'power2.out',
        });
    }
}

/**
 * Subtle entrance animation for a single element.
 * @param {HTMLElement} el
 * @param {Object} [opts]
 */
function animateEntrance(el, opts) {
    if (!el || typeof gsap === 'undefined') return;
    const defaults = { y: 16, opacity: 0, duration: 0.4, ease: 'power2.out' };
    const cfg = Object.assign({}, defaults, opts);
    gsap.fromTo(el, { opacity: 0, y: cfg.y }, { opacity: 1, y: 0, duration: cfg.duration, ease: cfg.ease });
}

// ---- Hammer.js Gesture Helpers ----

/**
 * Attach pan gestures to the image-adjust preview for drag-to-position.
 * Called from startImageAdjust() in memories.js.
 * @param {HTMLElement} previewEl - The .image-adjust-preview container
 * @param {HTMLInputElement} xSlider
 * @param {HTMLInputElement} ySlider
 * @param {Function} updateFn - Called when sliders change
 */
function attachImageAdjustGestures(previewEl, xSlider, ySlider, updateFn) {
    if (typeof Hammer === 'undefined' || !previewEl) return;

    const mc = new Hammer.Manager(previewEl, {
        recognizers: [
            [Hammer.Pan, { direction: Hammer.DIRECTION_ALL, threshold: 5 }]
        ]
    });

    let startX = parseInt(xSlider.value);
    let startY = parseInt(ySlider.value);

    mc.on('panstart', () => {
        startX = parseInt(xSlider.value);
        startY = parseInt(ySlider.value);
    });

    mc.on('panmove', (ev) => {
        // Convert pixel delta to percentage of preview size
        const rect = previewEl.getBoundingClientRect();
        const dx = (ev.deltaX / rect.width) * -100;
        const dy = (ev.deltaY / rect.height) * -100;

        const newX = Math.max(0, Math.min(100, startX + dx));
        const newY = Math.max(0, Math.min(100, startY + dy));

        xSlider.value = Math.round(newX);
        ySlider.value = Math.round(newY);
        updateFn();
    });

    // Return the Hammer manager so it can be destroyed on modal close
    return mc;
}

// ---- Initialization ----

document.addEventListener('DOMContentLoaded', () => {
    initSmoothScroll();
});
