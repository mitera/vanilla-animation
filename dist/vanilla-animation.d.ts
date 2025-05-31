/**
 * vanilla-animation v0.0.6 by @mitera
 * Simone Miterangelis <simone@mite.it>
 * License: MIT
 */
interface VanillaAnimationSettings {
    boxClass: string;
    animatePrefix: string;
    animateClass: string;
    offset: number;
    mobile: boolean;
    live: boolean;
    scrollContainer: string | null;
    callback: any;
}
declare class VanillaAnimation {
    private items;
    private offsetItems;
    private settings;
    private container;
    constructor(settings: VanillaAnimationSettings);
    /**
     * Initializes the scroll event listener to trigger animations on elements.
     * This method sets up an event listener on the window object to monitor the scroll position
     * and evaluates each element in the `offsetItems` array. If the scroll position meets
     * the specified offset condition, the element's animation is triggered, and it is removed
     * from the `offsetItems` array to prevent repeat processing.
     *
     * @return {void} This method does not return a value.
     */
    private initScrollEvent;
    /**
     * Resets all items to their initial state by iterating through the list
     * of items and calling the resetItem method on each one.
     *
     * @return {void} Does not return any value.
     */
    protected resetItems(): void;
    /**
     * Resets the given item's visibility and animation classes.
     *
     * @param {HTMLElement} item - The HTML element to be reset. This element's visibility will be set to 'hidden',
     *                              and if it has an animation applied, the animation classes will be modified or removed.
     * @return {void} This method does not return a value.
     */
    protected resetItem(item: HTMLElement): void;
    /**
     * Creates and returns an IntersectionObserver instance that observes elements for intersection events.
     * The observer assesses if elements come into view and triggers the appropriate actions such as storing
     * elements for later animation or initiating animations for visible elements.
     *
     * @protected
     * @return {IntersectionObserver} The created IntersectionObserver instance that is configured with the behavior to handle intersection events.
     */
    protected intertsectionObserve(): IntersectionObserver;
    /**
     * Triggers an animation on the given HTML element by applying relevant CSS classes and styles.
     *
     * @param {HTMLElement} item The element on which the animation should be performed.
     * The function reads dataset properties and computed styles to configure the animation.
     * @return {undefined} This method does not return any value.
     */
    private doAnimation;
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
    protected parseDuration(duration: string): number;
    /**
     * Observes mutations in the DOM to detect added nodes that match specified criteria.
     * If a newly added node matches the required class, it resets the item and observes it
     * using an IntersectionObserver if supported by the browser.
     *
     * @return {void} Does not return any value.
     */
    protected observeItemMutation(): void;
    /**
     * Determines whether the given user agent string corresponds to a mobile device.
     *
     * @param {string} agent - The user agent string to evaluate.
     * @return {boolean} True if the user agent string indicates a mobile device, otherwise false.
     */
    protected isMobile(agent: string): boolean;
    /**
     * Checks if the given HTML element is visible within the visible area of the container,
     * considering a specific offset.
     *
     * @param {HTMLElement} item - The HTML element to check visibility for.
     * @return {boolean} Returns true if the element is visible, false otherwise.
     */
    protected isVisible(item: HTMLElement): boolean;
}
