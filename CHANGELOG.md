<a name="1.1.0"></a>
# 1.1.0 (2026-10-15)

### release summary

- Fix the callback timing: the delay was ignored (the duration was added twice), seconds were truncated (`0.5s` → 0 ms) and the iteration count was not considered.
- Fix `data-vanimation` with more than one class (e.g. `animate__fadeIn animate__slow`): `classList` threw an error and the item stayed hidden.
- Fix `data-vanimation-reload`: the item was hidden again but never animated, because the animation classes were not removed.
- Fix items with the `animateClass` (e.g. `animate__animated`) already set in the HTML: they stayed hidden forever.
- Fix items waiting for their offset: with more than one item, scrolling animated only part of them.
- Fix the initialization when the script is loaded in `<head>`: the items are now collected on `DOMContentLoaded`.
- Fix `scrollContainer`: the scroll is now read from the container instead of the window.
- Fix the class `none` added to items without animation.
- Live detection uses `boxClass` and also finds the items nested in the added nodes; a single `IntersectionObserver` is shared by all the items and animated items are no longer observed; the `MutationObserver` only watches `data-vanimation-reload`.
- Without `IntersectionObserver` the items are no longer hidden forever.
- Add `destroy()` to remove observers, listeners and pending callbacks.
- TypeScript: the constructor accepts a partial settings object, `callback` is typed and `VanillaAnimationSettings` is exported.
- Publish only `dist` on npm; remove the unused `esbuild` dev dependency.

<a name="1.0.8"></a>
# 1.0.8 (2026-02-10)

### release summary

- Fix `animation-iteration-count` assignment bug and enhance MutationObserver logic to support `data-vanimation` attribute. Update dynamic class detection for improved flexibility.

<a name="1.0.7"></a>
# 1.0.7 (2025-09-22)

### release summary

- Update boxClass selector to support multiple formats (class and data attribute)

<a name="1.0.6"></a>
# 1.0.6 (2025-07-24)

### release summary

- Enable attribute-based "data-vanimation-reload" support for dynamic animation reset logic. Update MutationObserver to observe attribute changes.

<a name="1.0.5"></a>
# 1.0.5 (2025-06-03)

### release summary

- Fix animation reset logic to prevent overwriting existing data attributes. Update version, changelog, and README for improved clarity and compatibility notes.

<a name="1.0.4"></a>
# 1.0.4 (2025-06-01)

### release summary

- Update version metadata, changelog, and README improvements for clarity.

<a name="1.0.3"></a>
# 1.0.3 (2025-05-31)

### release summary

- Update version, build scripts, and metadata for release. Minor changelog adjustments included.

<a name="1.0.2"></a>
# 1.0.2 (2025-05-31)

### release summary

- Add optional `settings` parameter to constructor. Update version, metadata, and changelog for release.

<a name="1.0.1"></a>
# 1.0.1 (2025-05-31)

### release summary

- Migrate to Rollup for bundling. Update metadata, add UMD build, and improve minified files. Adjust changelog for release.

<a name="1.0.0"></a>
# 1.0.0 (2025-05-31)

### release summary

- Major version update with callback validation improvements, changelog addition, and updated metadata across files.

<a name="0.0.6"></a>
# 0.0.6 (2025-05-31)

### release summary

- Update version, changelog, and documentation.

<a name="0.0.5"></a>
# 0.0.5 (2025-05-31)

### release summary

- Add callback support to trigger custom actions after animations. Refactor animation handling and update version, documentation, and changelog.

<a name="0.0.4"></a>
# 0.0.4 (2025-05-31)

### release summary

- Add support for custom animation duration, delay, and iteration via data attributes. Update version and changelog.

<a name="0.0.3"></a>
# 0.0.3 (2025-05-31)

### release summary

- updating documentation

<a name="0.0.2"></a>
# 0.0.2 (2025-05-31)

### release summary

- updating documentation

<a name="0.0.1"></a>
# 0.0.1 (2025-05-31)

### release summary

- initial release