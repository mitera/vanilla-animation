import { VanillaAnimationSettings } from "./types";
export type { VanillaAnimationSettings };
export default class VanillaAnimation {
    private offsetItems;
    private settings;
    private container;
    private scrollTarget;
    private itemObserver;
    private mutationObserver;
    private callbackTimers;
    private readonly onReady;
    private readonly onScroll;
    constructor(settings?: Partial<VanillaAnimationSettings>);
    /**
     * Stops observing the items and removes every listener and pending callback.
     * Items that have not been animated yet keep their current state.
     *
     * @return {void} This method does not return a value.
     */
    destroy(): void;
    /**
     * Collects the items inside the container, hides them and starts observing them,
     * the DOM mutations (if `live` is enabled) and the scroll position.
     *
     * @return {void} This method does not return a value.
     */
    private init;
    /**
     * Resets the given item and (re)starts observing it.
     *
     * @param {HTMLElement} item - The element to animate when it enters the viewport.
     * @return {void} This method does not return a value.
     */
    protected watchItem(item: HTMLElement): void;
    /**
     * Evaluates the items waiting for their offset: when the scroll position goes beyond
     * the stored position plus the offset, the item is animated and removed from the list.
     *
     * @return {void} This method does not return a value.
     */
    private handleScroll;
    /**
     * Resets the given item's visibility and animation classes, so that it can be animated (again).
     *
     * @param {HTMLElement} item - The HTML element to be reset. This element's visibility will be set to 'hidden',
     *                              and the classes added by a previous animation are removed.
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
    protected intersectionObserve(): IntersectionObserver;
    /**
     * Triggers an animation on the given HTML element by applying relevant CSS classes and styles.
     *
     * @param {HTMLElement} item The element on which the animation should be performed.
     * The function reads the data attributes and computed styles to configure the animation.
     * @return {undefined} This method does not return any value.
     */
    private doAnimation;
    /**
     * Parses a CSS time value and converts it to milliseconds.
     * Values ending in 'ms' are returned as-is, values ending in 's' are multiplied by 1000.
     * When a list of values is given (e.g. "1s, 2s") only the first one is used.
     * If the input is invalid or empty, the method returns 0.
     *
     * @param {string} duration - The duration string to parse, e.g. "500ms" or "0.5s".
     * @return {number} The duration in milliseconds.
     */
    protected parseDuration(duration: string): number;
    /**
     * Observes mutations in the DOM to detect added nodes (and their descendants) that match `boxClass`,
     * and the `data-{name}-reload` attribute set to "true" to animate an item again.
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
     * Checks if the given HTML element is inside the viewport, considering a specific offset
     * from the bottom of the viewport.
     *
     * @param {HTMLElement} item - The HTML element to check visibility for.
     * @return {boolean} Returns true if the element is visible, false otherwise.
     */
    protected isVisible(item: HTMLElement): boolean;
    /**
     * Returns the offset of the given item: `data-{name}-offset` if valid, otherwise the `offset` setting.
     *
     * @param {HTMLElement} item - The HTML element.
     * @return {number} The offset in pixels.
     */
    protected getOffset(item: HTMLElement): number;
    /**
     * Returns the current vertical scroll position of the scroll target (window or scroll container).
     *
     * @return {number} The scroll position in pixels.
     */
    protected getScrollY(): number;
    /**
     * Returns the name of a data attribute built on the `name` setting,
     * e.g. `data-vanimation` or `data-vanimation-delay` (`data-wow-delay` with `name: 'wow'`).
     *
     * @param {string} [suffix] - The attribute suffix (e.g. "delay"), omitted for the animation attribute.
     * @return {string} The attribute name.
     */
    protected dataAttribute(suffix?: string): string;
    /**
     * Returns the value of a data attribute built on the `name` setting.
     *
     * @param {HTMLElement} item - The HTML element.
     * @param {string} [suffix] - The attribute suffix (e.g. "delay"), omitted for the animation attribute.
     * @return {string | null} The attribute value, or null if it is not set.
     */
    protected getData(item: HTMLElement, suffix?: string): string | null;
    /**
     * Splits a class attribute value into the single class names (`classList` throws on spaces or empty tokens).
     *
     * @param {string} value - The class names separated by white spaces.
     * @return {string[]} The class names.
     */
    private splitClasses;
}
