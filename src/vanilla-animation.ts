import {VanillaAnimationSettings} from "./types";

export type {VanillaAnimationSettings};

export default class VanillaAnimation {

    private offsetItems: HTMLElement[] = [];
    private settings: VanillaAnimationSettings;
    private container: HTMLElement | null = null;
    private scrollTarget: HTMLElement | Window = window;
    private itemObserver: IntersectionObserver | null = null;
    private mutationObserver: MutationObserver | null = null;
    // pending callback timer of each animated item
    private callbackTimers = new Map<HTMLElement, number>();
    private readonly onReady: () => void;
    private readonly onScroll: () => void;

    constructor(settings?: Partial<VanillaAnimationSettings>) {

        // the name drives the default box selector and the data attributes (e.g. 'wow' for data-wow-*)
        const name = settings?.name || 'vanimation';
        let default_settings: VanillaAnimationSettings = {
            name: name,
            boxClass: `.${name}, [data-${name}]`,
            animatePrefix: 'animate__',
            animateClass: 'animate__animated',
            offset: 0,
            mobile: true,
            live: true,
            scrollContainer: null,
            callback: null
        }

        this.settings = {...default_settings, ...settings, name: name};
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
        } else {
            document.addEventListener('DOMContentLoaded', this.onReady, { once: true });
        }
    }

    /**
     * Stops observing the items and removes every listener and pending callback.
     * Items that have not been animated yet keep their current state.
     *
     * @return {void} This method does not return a value.
     */
    public destroy() {
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
        this.callbackTimers.clear();
        this.offsetItems = [];
    }

    /**
     * Collects the items inside the container, hides them and starts observing them,
     * the DOM mutations (if `live` is enabled) and the scroll position.
     *
     * @return {void} This method does not return a value.
     */
    private init() {
        this.container = document.body;
        if (this.settings.scrollContainer) {
            const container = document.querySelector<HTMLElement>(this.settings.scrollContainer);
            if (container) {
                this.container = container;
            }
        }
        this.scrollTarget = this.container === document.body ? window : this.container;

        this.itemObserver = this.intersectionObserve();
        this.container.querySelectorAll<HTMLElement>(this.settings.boxClass).forEach(item => {
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
    protected watchItem(item: HTMLElement) {
        if (!this.itemObserver) return;
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
    private handleScroll() {
        const scrollY = this.getScrollY();
        this.offsetItems = this.offsetItems.filter(item => {
            const startY = parseInt(this.getData(item, 'scrolly') || '', 10);
            if (isNaN(startY) || startY + this.getOffset(item) >= scrollY) {
                return true;
            }
            item.removeAttribute(this.dataAttribute('scrolly'));
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
    protected resetItem(item: HTMLElement) {
        item.style.visibility = 'hidden';
        const animation = this.getData(item);
        if (animation) {
            item.classList.remove(...this.splitClasses(animation));
        } else {
            // only the first animation is taken when several are set (e.g. "fadeIn, pulse")
            let animationName = window.getComputedStyle(item).getPropertyValue('animation-name').split(',')[0].trim();
            if (animationName && animationName != 'none') {
                item.classList.remove(this.settings.animatePrefix + animationName);
                item.setAttribute(this.dataAttribute(), this.settings.animatePrefix + animationName);
            }
        }
        item.classList.remove(this.settings.animateClass);
        item.removeAttribute(this.dataAttribute('scrolly'));
        this.offsetItems = this.offsetItems.filter(offsetItem => offsetItem !== item);
        this.clearCallbackTimer(item);
    }

    /**
     * Cancels the pending callback of the given item (e.g. when it is reloaded before its animation is completed).
     *
     * @param {HTMLElement} item - The HTML element.
     * @return {void} This method does not return a value.
     */
    private clearCallbackTimer(item: HTMLElement) {
        const timer = this.callbackTimers.get(item);
        if (timer !== undefined) {
            window.clearTimeout(timer);
            this.callbackTimers.delete(item);
        }
    }

    /**
     * Creates and returns an IntersectionObserver instance that observes elements for intersection events.
     * The observer assesses if elements come into view and triggers the appropriate actions such as storing
     * elements for later animation or initiating animations for visible elements.
     *
     * @protected
     * @return {IntersectionObserver} The created IntersectionObserver instance that is configured with the behavior to handle intersection events.
     */
    protected intersectionObserve() {
        return new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                let item = <HTMLElement>entry.target;
                if (item.classList.contains(this.settings.animateClass) || this.offsetItems.indexOf(item) > -1) return;
                if (this.isVisible(item)) {
                    this.doAnimation(item);
                } else {
                    item.setAttribute(this.dataAttribute('scrolly'), this.getScrollY() + '');
                    this.offsetItems.push(item);
                }
            });
        });
    }

    /**
     * Triggers an animation on the given HTML element by applying relevant CSS classes and styles.
     *
     * @param {HTMLElement} item The element on which the animation should be performed.
     * The function reads the data attributes and computed styles to configure the animation.
     * @return {undefined} This method does not return any value.
     */
    private doAnimation(item: HTMLElement) {
        if (this.itemObserver) {
            this.itemObserver.unobserve(item);
        }
        item.classList.add(...this.splitClasses(this.getData(item) || ''), this.settings.animateClass);
        item.style.visibility = 'visible';
        const computedStyle = window.getComputedStyle(item);
        let duration = this.getData(item, 'duration') || computedStyle.getPropertyValue('animation-duration');
        if (duration) {
            item.style.setProperty('animation-duration', duration);
        }
        let delay = this.getData(item, 'delay') || computedStyle.getPropertyValue('animation-delay');
        if (delay) {
            item.style.setProperty('animation-delay', delay);
        }
        let iteration = this.getData(item, 'iteration') || computedStyle.getPropertyValue('animation-iteration-count');
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
            this.clearCallbackTimer(item);
            this.callbackTimers.set(item, window.setTimeout(() => {
                this.callbackTimers.delete(item);
                callback(item);
            }, totalDuration));
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
    protected parseDuration(duration: string) {
        const value = (duration || '').split(',')[0].trim().toLowerCase();
        const amount = parseFloat(value);
        if (isNaN(amount)) return 0;
        if (value.slice(-2) === 'ms') return amount;
        if (value.slice(-1) === 's') return amount * 1000;
        return amount;
    }

    /**
     * Observes mutations in the DOM to detect added nodes (and their descendants) that match `boxClass`,
     * and the `data-{name}-reload` attribute set to "true" to animate an item again.
     *
     * @return {void} Does not return any value.
     */
    protected observeItemMutation() {
        if (!this.container) return;
        const reloadAttribute = this.dataAttribute('reload');
        this.mutationObserver = new MutationObserver(mutations => {
            for (let mutation of mutations) {
                if (mutation.type === 'childList') {
                    for (let node of mutation.addedNodes) {
                        if (!(node instanceof HTMLElement)) continue;
                        if (node.matches(this.settings.boxClass)) {
                            this.watchItem(node);
                        }
                        node.querySelectorAll<HTMLElement>(this.settings.boxClass).forEach(item => {
                            this.watchItem(item);
                        });
                    }
                } else if (mutation.type === 'attributes' && mutation.target instanceof HTMLElement) {
                    if (mutation.target.getAttribute(reloadAttribute) === 'true') {
                        this.watchItem(mutation.target);
                    }
                }
            }
        });
        this.mutationObserver.observe(this.container, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: [reloadAttribute]
        });
    }

    /**
     * Determines whether the given user agent string corresponds to a mobile device.
     *
     * @param {string} agent - The user agent string to evaluate.
     * @return {boolean} True if the user agent string indicates a mobile device, otherwise false.
     */
    protected isMobile(agent: string) {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(agent);
    }

    /**
     * Checks if the given HTML element is inside the viewport, considering a specific offset
     * from the bottom of the viewport.
     *
     * @param {HTMLElement} item - The HTML element to check visibility for.
     * @return {boolean} Returns true if the element is visible, false otherwise.
     */
    protected isVisible(item: HTMLElement) {
        const viewBottom = Math.min(document.documentElement.clientHeight, window.innerHeight) - this.getOffset(item);
        const rect = item.getBoundingClientRect();
        // items above the top of the viewport (already scrolled past) are always animated
        return rect.top < 0 || (rect.top <= viewBottom && rect.bottom >= 0);
    }

    /**
     * Returns the offset of the given item: `data-{name}-offset` if valid, otherwise the `offset` setting.
     *
     * @param {HTMLElement} item - The HTML element.
     * @return {number} The offset in pixels.
     */
    protected getOffset(item: HTMLElement) {
        const offset = parseInt(this.getData(item, 'offset') || '', 10);
        return isNaN(offset) ? this.settings.offset : offset;
    }

    /**
     * Returns the current vertical scroll position of the scroll target (window or scroll container).
     *
     * @return {number} The scroll position in pixels.
     */
    protected getScrollY() {
        return this.scrollTarget === window ? window.scrollY : (<HTMLElement>this.scrollTarget).scrollTop;
    }

    /**
     * Returns the name of a data attribute built on the `name` setting,
     * e.g. `data-vanimation` or `data-vanimation-delay` (`data-wow-delay` with `name: 'wow'`).
     *
     * @param {string} [suffix] - The attribute suffix (e.g. "delay"), omitted for the animation attribute.
     * @return {string} The attribute name.
     */
    protected dataAttribute(suffix?: string) {
        return 'data-' + this.settings.name + (suffix ? '-' + suffix : '');
    }

    /**
     * Returns the value of a data attribute built on the `name` setting.
     *
     * @param {HTMLElement} item - The HTML element.
     * @param {string} [suffix] - The attribute suffix (e.g. "delay"), omitted for the animation attribute.
     * @return {string | null} The attribute value, or null if it is not set.
     */
    protected getData(item: HTMLElement, suffix?: string) {
        return item.getAttribute(this.dataAttribute(suffix));
    }

    /**
     * Splits a class attribute value into the single class names (`classList` throws on spaces or empty tokens).
     *
     * @param {string} value - The class names separated by white spaces.
     * @return {string[]} The class names.
     */
    private splitClasses(value?: string) {
        return (value || '').split(/\s+/).filter(Boolean);
    }
}
