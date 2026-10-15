# vanilla-animation.js #

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![Socket Badge](https://socket.dev/api/badge/npm/package/vanilla-animation)](https://socket.dev/npm/package/vanilla-animation)
[![jsdelivr](https://data.jsdelivr.com/v1/package/npm/vanilla-animation/badge)](https://www.jsdelivr.com/package/npm/vanilla-animation)
[![npm](https://img.shields.io/npm/v/vanilla-animation.svg?logo=npm&logoColor=fff&label=npm)](https://www.npmjs.com/package/vanilla-animation)
[![npm downloads](https://img.shields.io/npm/dm/vanilla-animation.svg?style=flat-square)](https://www.npmjs.com/package/vanilla-animation)
[![yarn](https://img.shields.io/npm/v/vanilla-animation.svg?logo=yarn&logoColor=fff&label=yarn)](https://yarnpkg.com/package?name=vanilla-animation)

[Demo](#demo) - [Features](#features) - [Install](#install) - [Usage](#usage) - [Options](#options) - [Methods](#methods) - [Data API](#data-api) -  [Changelog](#changelog) - [License](#license)

## *Inspired by:* AOS and WOW

> *Vanilla Animation:* super light lib to reveal CSS animations as you scroll down a page.

### Demo

See the [vanilla-animation.js demo](https://codepen.io/mitera/pen/azOdmrv).

### Features

- reveal CSS animations as you scroll down a page
- by default, you can use it to trigger [animate.css](https://animate.style) animations. But you can easily change the settings to your favorite animation library.
- anywhere on the page and anywhere in the DOM
- tested in Edge, Chrome, Firefox

### Install

CDN via jsDelivr

    <script src="https://cdn.jsdelivr.net/npm/vanilla-animation@1.1.0/dist/vanilla-animation.min.js" type="text/javascript"></script>

Pin an exact version (not `@latest`) in production, so that a new release cannot change your pages without notice.

Download [vanilla-animation.min.js](https://github.com/mitera/vanilla-animation/blob/main/dist/vanilla-animation.min.js) and include the script in your HTML file:

    <script src="vanilla-animation.min.js" type="text/javascript"></script>

You can also install it with [npm](https://www.npmjs.com/package/vanilla-animation):

    npm install vanilla-animation

and import it as a module (TypeScript types included):

    import VanillaAnimation from 'vanilla-animation'
    import type { VanillaAnimationSettings } from 'vanilla-animation'

### Usage

Add styles in `<head>`:
    
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />

Add the script right before the closing `</body>` tag and initialize it (in `<head>` it works too: the items are collected when the DOM is ready):

    <script>
        new VanillaAnimation();
    </script>

Set the CSS animation on the `data-vanimation` attribute or directly on the `class` attribute:

    <div data-vanimation="animate__fadeIn">
        test1
    </div>

For compatibility with `wow`, add `vanimation` to the `class` attribute and use the `animate__` animation directly as a class:

    <div class="vanimation animate__fadeIn">
        test2
    </div>

And adjust the behaviour with the `data-vanimation-*` attributes:

    <div 
        data-vanimation="animate__fadeIn"
        data-vanimation-offset="200"
        data-vanimation-delay="50ms"
        data-vanimation-duration="1000ms"
        data-vanimation-iteration="5"
    >
        test3
    </div>

### Options

The default `options` are:

    {
        boxClass: '.vanimation, [data-vanimation]',
        animatePrefix: 'animate__',
        animateClass: 'animate__animated',
        offset: 0,
        mobile: true,
        live: true,
        scrollContainer: null,
        callback: null
    }

Where:

- `boxClass` is the CSS selector of the items to animate (it must be a valid CSS selector)
- `animatePrefix` is the prefix of the animation class, used when the animation is set on the `class` attribute instead of `data-vanimation` (e.g. `animate__` + `fadeIn`)
- `animateClass` is the class added to start the animation (`animate__animated` for animate.css); it also marks the items already animated
- `offset` is the distance in pixels from the bottom of the viewport: an item is animated only after it has entered the viewport by this distance
- `mobile` is `false` to disable the animations on mobile devices (the items are shown without animation)
- `live` is `true` to detect the items added to the page later and the `data-vanimation-reload` attribute
- `scrollContainer` is an optional CSS selector of the scrolling element to use instead of the window
- `callback` is a function called with the item when its animation is completed (delay + duration × iterations; an infinite animation counts as one iteration)
  ```
    new VanillaAnimation({
        callback: function(el) {
            el.classList.add("vanimation-active");
        }
    });
  ```
You can pass only the options you want to change: the others keep their default value.

### Methods

- `destroy()` stops observing the items and removes the listeners and the pending callbacks (e.g. when a single page application removes the page)
  ```
    const animation = new VanillaAnimation();
    animation.destroy();
  ```

### Data API

- `data-vanimation="animate__fadeIn"` is the animation class name (more classes separated by spaces are allowed, e.g. `animate__fadeIn animate__slow`)
- `data-vanimation-offset="200"` is the offset in pixels for this item (it overrides the `offset` option)
- `data-vanimation-delay="0.5s"` is the animation delay, in seconds (`s`) or milliseconds (`ms`)
- `data-vanimation-duration="500ms"` is the animation duration, in seconds (`s`) or milliseconds (`ms`)
- `data-vanimation-iteration="5"` is the animation iteration count
- `data-vanimation-reload="true"` replays the animation: the item is hidden and animated again when it enters the viewport (requires `live: true`; set the attribute again to replay it once more)

### Known limitations

#### CSS transitions and animations on mobile device

Chrome on Android requires that you set "minimum-scale=1" in the "viewport" meta of your page.
Not doing so causes the scrollY value to start increasing only after a good portion of the page is already scrolled.

    <meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1">

### Changelog

To see what's new or changed in the latest version, see the [changelog](https://github.com/mitera/vanilla-animation/blob/main/CHANGELOG.md)

### License

vanilla-animation.js is licensed under [The MIT License (MIT)](http://opensource.org/licenses/MIT)
<br/>Copyright (c) 2025 Simone Miterangelis

This license is also supplied with the release and source code.
<br/>As stated in the license, absolutely no warranty is provided.