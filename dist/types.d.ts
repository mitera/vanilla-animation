interface VanillaAnimationSettings {
    boxClass: string;
    animatePrefix: string;
    animateClass: string;
    offset: number;
    mobile: boolean;
    live: boolean;
    scrollContainer: string | null;
    callback: ((item: HTMLElement) => void) | null;
}
export { VanillaAnimationSettings };
