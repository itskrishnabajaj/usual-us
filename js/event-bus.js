// ============================================
// Lightweight Event Bus — Central Communication Layer
// ============================================
// Modules emit events describing what happened.
// Other modules subscribe and react independently.
// No external libraries — zero-dependency, tiny footprint.

const EventBus = (() => {
    /** @type {Object<string, Array<{fn: Function, once: boolean}>>} */
    const _listeners = {};

    /**
     * Subscribe to an event.
     * @param {string} event  Event name
     * @param {Function} fn   Callback
     * @returns {Function}    Unsubscribe function for easy cleanup
     */
    function on(event, fn) {
        if (!_listeners[event]) _listeners[event] = [];
        const entry = { fn, once: false };
        _listeners[event].push(entry);
        // Return an unsubscribe handle
        return () => off(event, fn);
    }

    /**
     * Subscribe to an event, automatically removed after first call.
     * @param {string} event
     * @param {Function} fn
     * @returns {Function} Unsubscribe function
     */
    function once(event, fn) {
        if (!_listeners[event]) _listeners[event] = [];
        const entry = { fn, once: true };
        _listeners[event].push(entry);
        return () => off(event, fn);
    }

    /**
     * Remove a specific listener.
     * @param {string} event
     * @param {Function} fn
     */
    function off(event, fn) {
        const list = _listeners[event];
        if (!list) return;
        _listeners[event] = list.filter(entry => entry.fn !== fn);
        if (_listeners[event].length === 0) delete _listeners[event];
    }

    /**
     * Emit an event with optional detail payload.
     * Listeners are called synchronously in registration order.
     * @param {string} event
     * @param {*} [detail]
     */
    function emit(event, detail) {
        const list = _listeners[event];
        if (!list || list.length === 0) return;
        // Snapshot the array so removals during iteration are safe
        const snapshot = list.slice();
        for (let i = 0; i < snapshot.length; i++) {
            const entry = snapshot[i];
            try {
                entry.fn(detail);
            } catch (err) {
                console.error(`[EventBus] Error in listener for "${event}":`, err);
            }
            if (entry.once) off(event, entry.fn);
        }
    }

    /**
     * Remove all listeners for an event, or all listeners entirely.
     * @param {string} [event]  If omitted, clears everything.
     */
    function clear(event) {
        if (event) {
            delete _listeners[event];
        } else {
            for (const key in _listeners) delete _listeners[key];
        }
    }

    return { on, once, off, emit, clear };
})();
