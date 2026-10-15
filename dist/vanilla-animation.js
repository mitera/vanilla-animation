/*!
 * @author Simone Miterangelis <simone@mite.it>
 * vanilla-animation v1.1.0 by @mitera
 * https://github.com/mitera/vanilla-animation
 * Released under the MIT License.
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.VanillaAnimation = factory());
})(this, (function () { 'use strict';

	class VanillaAnimation {
	    constructor(settings) {
	        this.offsetItems = [];
	        this.container = null;
	        this.scrollTarget = window;
	        this.itemObserver = null;
	        this.mutationObserver = null;
	        this.callbackTimers = [];
	        let default_settings = {
	            boxClass: '.vanimation, [data-vanimation]',
	            animatePrefix: 'animate__',
	            animateClass: 'animate__animated',
	            offset: 0,
	            mobile: true,
	            live: true,
	            scrollContainer: null,
	            callback: null
	        };
	        this.settings = Object.assign(Object.assign({}, default_settings), settings);
	        this.onReady = this.init.bind(this);
	        this.onScroll = this.handleScroll.bind(this);
	        let disabled = !this.settings.mobile && this.isMobile(navigator.userAgent);
	        // Without IntersectionObserver the items are left untouched (visible, not animated)
	        if (disabled || !("IntersectionObserver" in window)) {
	            return;
	        }
	        // The items can only be collected once the DOM is parsed (the script may be loaded in <head>)
	        if (document.readyState !== 'loading') {
	            this.init();
	        }
	        else {
	            document.addEventListener('DOMContentLoaded', this.onReady, { once: true });
	        }
	    }
	    /**
	     * Stops observing the items and removes every listener and pending callback.
	     * Items that have not been animated yet keep their current state.
	     *
	     * @return {void} This method does not return a value.
	     */
	    destroy() {
	        document.removeEventListener('DOMContentLoaded', this.onReady);
	        this.scrollTarget.removeEventListener('scroll', this.onScroll);
	        if (this.itemObserver) {
	            this.itemObserver.disconnect();
	            this.itemObserver = null;
	        }
	        if (this.mutationObserver) {
	            this.mutationObserver.disconnect();
	            this.mutationObserver = null;
	        }
	        this.callbackTimers.forEach(timer => window.clearTimeout(timer));
	        this.callbackTimers = [];
	        this.offsetItems = [];
	    }
	    /**
	     * Collects the items inside the container, hides them and starts observing them,
	     * the DOM mutations (if `live` is enabled) and the scroll position.
	     *
	     * @return {void} This method does not return a value.
	     */
	    init() {
	        this.container = document.body;
	        if (this.settings.scrollContainer) {
	            const container = document.querySelector(this.settings.scrollContainer);
	            if (container) {
	                this.container = container;
	            }
	        }
	        this.scrollTarget = this.container === document.body ? window : this.container;
	        this.itemObserver = this.intersectionObserve();
	        this.container.querySelectorAll(this.settings.boxClass).forEach(item => {
	            this.watchItem(item);
	        });
	        if (this.settings.live) {
	            this.observeItemMutation();
	        }
	        this.scrollTarget.addEventListener('scroll', this.onScroll, { passive: true });
	    }
	    /**
	     * Resets the given item and (re)starts observing it.
	     *
	     * @param {HTMLElement} item - The element to animate when it enters the viewport.
	     * @return {void} This method does not return a value.
	     */
	    watchItem(item) {
	        if (!this.itemObserver)
	            return;
	        this.resetItem(item);
	        // unobserve first so that a reload always gets a fresh intersection entry
	        this.itemObserver.unobserve(item);
	        this.itemObserver.observe(item);
	    }
	    /**
	     * Evaluates the items waiting for their offset: when the scroll position goes beyond
	     * the stored position plus the offset, the item is animated and removed from the list.
	     *
	     * @return {void} This method does not return a value.
	     */
	    handleScroll() {
	        const scrollY = this.getScrollY();
	        this.offsetItems = this.offsetItems.filter(item => {
	            const startY = parseInt(item.dataset.vanimationScrolly || '', 10);
	            if (isNaN(startY) || startY + this.getOffset(item) >= scrollY) {
	                return true;
	            }
	            item.removeAttribute('data-vanimation-scrolly');
	            this.doAnimation(item);
	            return false;
	        });
	    }
	    /**
	     * Resets the given item's visibility and animation classes, so that it can be animated (again).
	     *
	     * @param {HTMLElement} item - The HTML element to be reset. This element's visibility will be set to 'hidden',
	     *                              and the classes added by a previous animation are removed.
	     * @return {void} This method does not return a value.
	     */
	    resetItem(item) {
	        item.style.visibility = 'hidden';
	        if (item.dataset.vanimation) {
	            item.classList.remove(...this.splitClasses(item.dataset.vanimation));
	        }
	        else {
	            // only the first animation is taken when several are set (e.g. "fadeIn, pulse")
	            let animationName = window.getComputedStyle(item).getPropertyValue('animation-name').split(',')[0].trim();
	            if (animationName && animationName != 'none') {
	                item.classList.remove(this.settings.animatePrefix + animationName);
	                item.dataset.vanimation = this.settings.animatePrefix + animationName;
	            }
	        }
	        item.classList.remove(this.settings.animateClass);
	        item.removeAttribute('data-vanimation-scrolly');
	        this.offsetItems = this.offsetItems.filter(offsetItem => offsetItem !== item);
	    }
	    /**
	     * Creates and returns an IntersectionObserver instance that observes elements for intersection events.
	     * The observer assesses if elements come into view and triggers the appropriate actions such as storing
	     * elements for later animation or initiating animations for visible elements.
	     *
	     * @protected
	     * @return {IntersectionObserver} The created IntersectionObserver instance that is configured with the behavior to handle intersection events.
	     */
	    intersectionObserve() {
	        return new IntersectionObserver(entries => {
	            entries.forEach(entry => {
	                if (!entry.isIntersecting)
	                    return;
	                let item = entry.target;
	                if (item.classList.contains(this.settings.animateClass) || this.offsetItems.indexOf(item) > -1)
	                    return;
	                if (this.isVisible(item)) {
	                    this.doAnimation(item);
	                }
	                else {
	                    item.dataset.vanimationScrolly = this.getScrollY() + '';
	                    this.offsetItems.push(item);
	                }
	            });
	        });
	    }
	    /**
	     * Triggers an animation on the given HTML element by applying relevant CSS classes and styles.
	     *
	     * @param {HTMLElement} item The element on which the animation should be performed.
	     * The function reads dataset properties and computed styles to configure the animation.
	     * @return {undefined} This method does not return any value.
	     */
	    doAnimation(item) {
	        if (this.itemObserver) {
	            this.itemObserver.unobserve(item);
	        }
	        item.classList.add(...this.splitClasses(item.dataset.vanimation), this.settings.animateClass);
	        item.style.visibility = 'visible';
	        const computedStyle = window.getComputedStyle(item);
	        let duration = item.dataset.vanimationDuration || computedStyle.getPropertyValue('animation-duration');
	        if (duration) {
	            item.style.setProperty('animation-duration', duration);
	        }
	        let delay = item.dataset.vanimationDelay || computedStyle.getPropertyValue('animation-delay');
	        if (delay) {
	            item.style.setProperty('animation-delay', delay);
	        }
	        let iteration = item.dataset.vanimationIteration || computedStyle.getPropertyValue('animation-iteration-count');
	        if (iteration) {
	            item.style.setProperty('animation-iteration-count', iteration);
	        }
	        const callback = this.settings.callback;
	        if (callback) {
	            // an infinite (or invalid) iteration count is counted as a single iteration
	            let iterationCount = parseFloat(iteration.split(',')[0]);
	            if (!isFinite(iterationCount) || iterationCount < 0) {
	                iterationCount = 1;
	            }
	            let totalDuration = this.parseDuration(delay) + this.parseDuration(duration) * iterationCount;
	            const timer = window.setTimeout(() => {
	                this.callbackTimers = this.callbackTimers.filter(callbackTimer => callbackTimer !== timer);
	                callback(item);
	            }, totalDuration);
	            this.callbackTimers.push(timer);
	        }
	    }
	    /**
	     * Parses a CSS time value and converts it to milliseconds.
	     * Values ending in 'ms' are returned as-is, values ending in 's' are multiplied by 1000.
	     * When a list of values is given (e.g. "1s, 2s") only the first one is used.
	     * If the input is invalid or empty, the method returns 0.
	     *
	     * @param {string} duration - The duration string to parse, e.g. "500ms" or "0.5s".
	     * @return {number} The duration in milliseconds.
	     */
	    parseDuration(duration) {
	        const value = (duration || '').split(',')[0].trim().toLowerCase();
	        const amount = parseFloat(value);
	        if (isNaN(amount))
	            return 0;
	        if (value.slice(-2) === 'ms')
	            return amount;
	        if (value.slice(-1) === 's')
	            return amount * 1000;
	        return amount;
	    }
	    /**
	     * Observes mutations in the DOM to detect added nodes (and their descendants) that match `boxClass`,
	     * and the `data-vanimation-reload` attribute set to "true" to animate an item again.
	     *
	     * @return {void} Does not return any value.
	     */
	    observeItemMutation() {
	        if (!this.container)
	            return;
	        this.mutationObserver = new MutationObserver(mutations => {
	            for (let mutation of mutations) {
	                if (mutation.type === 'childList') {
	                    for (let node of mutation.addedNodes) {
	                        if (!(node instanceof HTMLElement))
	                            continue;
	                        if (node.matches(this.settings.boxClass)) {
	                            this.watchItem(node);
	                        }
	                        node.querySelectorAll(this.settings.boxClass).forEach(item => {
	                            this.watchItem(item);
	                        });
	                    }
	                }
	                else if (mutation.type === 'attributes' && mutation.target instanceof HTMLElement) {
	                    if (mutation.target.getAttribute('data-vanimation-reload') === 'true') {
	                        this.watchItem(mutation.target);
	                    }
	                }
	            }
	        });
	        this.mutationObserver.observe(this.container, {
	            childList: true,
	            subtree: true,
	            attributes: true,
	            attributeFilter: ['data-vanimation-reload']
	        });
	    }
	    /**
	     * Determines whether the given user agent string corresponds to a mobile device.
	     *
	     * @param {string} agent - The user agent string to evaluate.
	     * @return {boolean} True if the user agent string indicates a mobile device, otherwise false.
	     */
	    isMobile(agent) {
	        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(agent);
	    }
	    /**
	     * Checks if the given HTML element is inside the viewport, considering a specific offset
	     * from the bottom of the viewport.
	     *
	     * @param {HTMLElement} item - The HTML element to check visibility for.
	     * @return {boolean} Returns true if the element is visible, false otherwise.
	     */
	    isVisible(item) {
	        const viewBottom = Math.min(document.documentElement.clientHeight, window.innerHeight) - this.getOffset(item);
	        const rect = item.getBoundingClientRect();
	        // items above the top of the viewport (already scrolled past) are always animated
	        return rect.top < 0 || (rect.top <= viewBottom && rect.bottom >= 0);
	    }
	    /**
	     * Returns the offset of the given item: `data-vanimation-offset` if valid, otherwise the `offset` setting.
	     *
	     * @param {HTMLElement} item - The HTML element.
	     * @return {number} The offset in pixels.
	     */
	    getOffset(item) {
	        const offset = parseInt(item.dataset.vanimationOffset || '', 10);
	        return isNaN(offset) ? this.settings.offset : offset;
	    }
	    /**
	     * Returns the current vertical scroll position of the scroll target (window or scroll container).
	     *
	     * @return {number} The scroll position in pixels.
	     */
	    getScrollY() {
	        return this.scrollTarget === window ? window.scrollY : this.scrollTarget.scrollTop;
	    }
	    /**
	     * Splits a class attribute value into the single class names (`classList` throws on spaces or empty tokens).
	     *
	     * @param {string} value - The class names separated by white spaces.
	     * @return {string[]} The class names.
	     */
	    splitClasses(value) {
	        return (value || '').split(/\s+/).filter(Boolean);
	    }
	}

	return VanillaAnimation;

}));
