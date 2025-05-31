import {VanillaAnimationSettings} from "./types";

export default class VanillaAnimation {

    private items: HTMLElement[];
    private offsetItems: HTMLElement[] = []
    private settings: VanillaAnimationSettings;
    private container: HTMLElement;

    constructor(settings?: VanillaAnimationSettings) {

        let default_settings: VanillaAnimationSettings = {
            boxClass: 'vanimation',
            animatePrefix: 'animate__',
            animateClass: 'animate__animated',
            offset: 0,
            mobile: true,
            live: true,
            scrollContainer: null,
            callback: null
        }

        this.settings = {...default_settings, ...settings} as VanillaAnimationSettings;

        let disabled = !this.settings.mobile && this.isMobile(navigator.userAgent);

        this.container = document.body;
        if (this.settings.scrollContainer) {
            const container = <HTMLElement>document.querySelector(this.settings.scrollContainer);
            if (container) {
                this.container = container;
            }
        }

        this.items = <HTMLElement[]>Array.from(this.container.querySelectorAll('.' + this.settings.boxClass));
        if (!disabled) {
            const update = this.resetItems.bind(this);
            if (document.readyState !== 'loading') {
                this.resetItems();
            } else {
                document.addEventListener( 'DOMContentLoaded', update, { once: true } );
            }

            if ("IntersectionObserver" in window) {
                let itemObserver = this.intertsectionObserve();
                this.items.forEach(function(item) {
                    itemObserver.observe(item);
                });
            }

            if (this.settings.live) {
                this.observeItemMutation();
            }
            this.initScrollEvent();
        }
    }

    /**
     * Initializes the scroll event listener to trigger animations on elements.
     * This method sets up an event listener on the window object to monitor the scroll position
     * and evaluates each element in the `offsetItems` array. If the scroll position meets
     * the specified offset condition, the element's animation is triggered, and it is removed
     * from the `offsetItems` array to prevent repeat processing.
     *
     * @return {void} This method does not return a value.
     */
    private initScrollEvent() {
        let $this = this
        window.addEventListener('scroll', function () {
            $this.offsetItems.forEach(function (item) {
                let offset = item.dataset.vanimationOffset ? parseInt(item.dataset.vanimationOffset) : $this.settings.offset;
                if (item.dataset.vanimationScrolly) {
                    if (parseInt(item.dataset.vanimationScrolly) + offset < window.scrollY) {
                        item.removeAttribute('data-vanimation-scrolly');
                        $this.doAnimation(item);
                        const index = $this.offsetItems.indexOf(item);
                        if (index > -1) {
                            $this.offsetItems.splice(index, 1);
                        }
                    }
                }
            });
        });
    }

    /**
     * Resets all items to their initial state by iterating through the list
     * of items and calling the resetItem method on each one.
     *
     * @return {void} Does not return any value.
     */
    protected resetItems() {
        let $this = this;
        this.items.forEach(function(item) {
            $this.resetItem(item);
        });
    }

    /**
     * Resets the given item's visibility and animation classes.
     *
     * @param {HTMLElement} item - The HTML element to be reset. This element's visibility will be set to 'hidden',
     *                              and if it has an animation applied, the animation classes will be modified or removed.
     * @return {void} This method does not return a value.
     */
    protected resetItem(item: HTMLElement) {
        item.style.visibility = 'hidden';
        let animationName = window.getComputedStyle(item).getPropertyValue('animation-name');
        if (animationName && animationName != 'none') {
            item.classList.remove(this.settings.animatePrefix + animationName);
            item.dataset.vanimation = this.settings.animatePrefix + animationName;
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
    protected intertsectionObserve() {
        let $this = this;
        let itemObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    let item: HTMLElement = <HTMLElement>entry.target;
                    if (!item.classList.contains($this.settings.animateClass)) {
                        if (!$this.isVisible(item)) {
                            item.dataset.vanimationScrolly = window.scrollY + '';
                            $this.offsetItems.push(item);
                        } else {
                            $this.doAnimation(item);
                        }
                    }
                }
            });
        });
        return itemObserver;
    }

    /**
     * Triggers an animation on the given HTML element by applying relevant CSS classes and styles.
     *
     * @param {HTMLElement} item The element on which the animation should be performed.
     * The function reads dataset properties and computed styles to configure the animation.
     * @return {undefined} This method does not return any value.
     */
    private doAnimation(item: HTMLElement) {
        let animationName = item.dataset.vanimation ? item.dataset.vanimation : 'none'
        item.classList.add(animationName);
        item.classList.add(this.settings.animateClass);
        item.style.visibility = 'visible';
        let duration = item.dataset.vanimationDuration ? item.dataset.vanimationDuration : window.getComputedStyle(item).getPropertyValue('animation-duration');
        if (duration) {
            item.style.setProperty('animation-duration', duration);
        }
        let delay = item.dataset.vanimationDelay ? item.dataset.vanimationDelay : window.getComputedStyle(item).getPropertyValue('animation-delay');
        if (delay) {
            item.style.setProperty('animation-delay', delay);
        }
        let iteration = item.dataset.vanimationIteration ? item.dataset.vanimationIteration : window.getComputedStyle(item).getPropertyValue('animation-iteration-count');
        if (iteration) {
            item.style.setProperty('animation-iteration-count', delay);
        }
        if (this.settings.callback) {
            let intDuration = this.parseDuration(duration);
            let intDelay = this.parseDuration(duration);
            let totalDuration = intDuration + intDelay;
            setTimeout(() => {
                this.settings.callback(item);
            }, totalDuration);
        }
    }

    /**
     * Parses a duration string and converts it to a number.
     * The method supports strings ending in 'ms' (milliseconds) or 's' (seconds).
     * If the string ends in 'ms', the numeric value is returned as-is.
     * If the string ends in 's', the numeric value is returned after removing the 's' suffix.
     * If the input is invalid or empty, the method returns 0.
     *
     * @param {string} duration - The duration string to parse. It should contain a number followed by 'ms' or 's'.
     * @return {number} The numeric value of the duration, interpreted as milliseconds if 'ms' is present, or as an integer value otherwise.
     */
    protected parseDuration(duration: string) {
        if (!duration) return 0;
        if (duration.indexOf('ms') > -1) {
            return parseInt(duration.replace('ms', ''));
        }
        let intDuration = parseInt(duration.replace('s', ''));
        return intDuration;
    }

    /**
     * Observes mutations in the DOM to detect added nodes that match specified criteria.
     * If a newly added node matches the required class, it resets the item and observes it
     * using an IntersectionObserver if supported by the browser.
     *
     * @return {void} Does not return any value.
     */
    protected observeItemMutation() {
        let observer = new MutationObserver(mutations => {
            for (let mutation of mutations) {
                for (let node of mutation.addedNodes) {
                    if (!(node instanceof HTMLElement)) continue;
                    if (node.classList.contains(this.settings.boxClass)) {
                        this.resetItem(node)
                        if ("IntersectionObserver" in window) {
                            let itemObserver = this.intertsectionObserve();
                            itemObserver.observe(node);
                        }
                    }
                }
            }
        });
        observer.observe(this.container, {childList: true, subtree: true,});
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
     * Checks if the given HTML element is visible within the visible area of the container,
     * considering a specific offset.
     *
     * @param {HTMLElement} item - The HTML element to check visibility for.
     * @return {boolean} Returns true if the element is visible, false otherwise.
     */
    protected isVisible(item: HTMLElement) {
        const offset = item.dataset.vanimationOffset ? parseInt(item.dataset.vanimationOffset) : this.settings.offset;
        const viewTop = this.container.scrollTop;
        const viewBottom = viewTop + Math.min(document.documentElement.clientHeight, window.innerHeight) - offset;
        const top = item.getBoundingClientRect().top;
        const bottom = top + item.clientHeight;
        let returnValue = top <= viewBottom && bottom >= viewTop;
        if (top < 0) returnValue = true;
        return returnValue;
    }
}