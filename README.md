# vanilla-animation.js #

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![Socket Badge](https://socket.dev/api/badge/npm/package/vanilla-animation)](https://socket.dev/npm/package/vanilla-animation)
[![jsdelivr](https://data.jsdelivr.com/v1/package/npm/vanilla-animation/badge)](https://www.jsdelivr.com/package/npm/vanilla-animation)
[![npm](https://img.shields.io/npm/v/vanilla-animation.svg?logo=npm&logoColor=fff&label=npm)](https://www.npmjs.com/package/vanilla-animation)
[![npm downloads](https://img.shields.io/npm/dm/vanilla-animation.svg?style=flat-square)](https://www.npmjs.com/package/vanilla-animation)
[![yarn](https://img.shields.io/npm/v/vanilla-animation.svg?logo=yarn&logoColor=fff&label=yarn)](https://yarnpkg.com/package?name=vanilla-animation)

[Demo](#demo) - [Features](#features) - [Install](#install) - [Usage](#usage) - [Options](#options) -  [Changelog](#changelog) - [License](#license)

## *Inspired by:* AOS ans WOW

> *Vanilla Animation:* super light lib for reveal CSS animation as you scroll down a page.

### Demo

See the [vanilla-animation.js demo](https://codepen.io/mitera/pen/azOdmrv).

### Features

- reveal CSS animation as you scroll down a page
- by default, you can use it to trigger animate.css animations
- anywhere on the page and anywhere in the DOM
- tested in Edge, Chrome, Firefox
- By default, you can use it to trigger [animate.css](https://animate.style) animations. But you can easily change the settings to your favorite animation library.

### Install

CDN via jsDelivr

    <script src="https://cdn.jsdelivr.net/npm/vanilla-animation@latest/dist/vanilla-animation.min.js" type="text/javascript"></script>

Download [vanilla-animation.js](https://github.com/mitera/vanilla-animation/blob/master/vanilla-animation.js) and include the script in your HTML file:

	<script src="vanilla-animation.js" type="text/javascript"></script>

You can also install using the package managers [NPM](https://www.npmjs.com/package/vanilla-animation).

    npm install vanilla-animation

modular code

    import 'vanilla-animation'

### Usage

    new VanillaAnimation();

### Options

The default `options` are:

    {
        boxClass: 'vanimation',
        animatePrefix: 'animate__',
        animateClass: 'animate__animated',
        offset: 0,
        mobile: true,
        live: true,
        scrollContainer: null
    }

Where:

- `boxClass` is a string that containing the selector classes. This string must be a valid CSS selector string
- `animatePrefix` is a string that indicated the prefix of animation.
- `animateClass` is a string that indicated the end of animation.
- `offset` is the offset in pixels from the bottom of the viewport when the animation should start
- `mobile` is `true` or `false` to enable mobile detection
- `live` is `true` or `false` to enable live detection
- `scrollContainer` is an optional element to use instead of the window

### Known limitations

#### CSS transitions and animations on mobile device

Chrome on Android requires that you set "minimum-scale=1" in the "viewport" meta of your page.
Not doing so causes the scrollY value to start increasing only after a good portion of the page is already scrolled

    <meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1">

### Changelog

To see what's new or changed in the latest version, see the [changelog](https://github.com/mitera/vanilla-animation/blob/master/CHANGELOG.md)

### License

vanilla-animation.js is licensed under [The MIT License (MIT)](http://opensource.org/licenses/MIT)
<br/>Copyright (c) 2025 Simone Miterangelis

This license is also supplied with the release and source code.
<br/>As stated in the license, absolutely no warranty is provided.