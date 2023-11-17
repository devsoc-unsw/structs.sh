# GSAP (GreenSock Animation Platform) with Trial Bonus Files

*** **DO NOT DEPLOY THESE FILES!** ***

This package is only intended for experimentation during development. It contains the public <a href="https://greensock.com">GSAP</a> files plus all bonus plugins which are normally available exclusively to Club GreenSock members, including <a href="https://greensock.com/scrollsmoother">ScrollSmoother</a>, <a href="https://greensock.com/drawsvg">DrawSVGPlugin</a>, <a href="https://greensock.com/morphsvg">MorphSVGPlugin</a>, <a href="https://greensock.com/splittext">SplitText</a>, <a href="https://greensock.com/gsdevtools">GSDevTools</a>, <a href="https://greensock.com/intertia">InertiaPlugin</a>, and more. The trial plugins only work locally and on certain approved domains like codesandbox.io, codepen.io, stackblitz.com, and jsfiddle.com. Deploying them elsewhere violates the license and will result in a browser redirect! 

Sign up for <a href="https://greensock.com/club">Club GreenSock</a> to get the **completely unrestricted** files.

No GSAP files (including the trial plugins) implement any tracking whatsoever. No data is collected.

### What is GSAP? (video)

[![What is GSAP?](http://greensock.com/_img/github/thumb-what-is-gsap-small.jpg)](http://www.youtube.com/watch?v=RYuau0NeR1U)

## Docs
View the <a href="https://greensock.com/docs">full documentation here</a>, including an <a href="https://greensock.com/install">installation guide</a> with videos.

## Usage on approved domain

On a whitelisted domain like <a href="https://codesandbox.io">codesandbox.io</a>, you can do this:
```javascript
// typical import
import gsap from "gsap-trial";

// or get other plugins:
import ScrollTrigger from "gsap-trial/ScrollTrigger";
import DrawSVGPlugin from "gsap-trial/DrawSVGPlugin";

// or all tools are exported from the "all" file (excluding bonus plugins):
import { gsap, ScrollTrigger, DrawSVGPlugin } from "gsap-trial/all";

// don't forget to register plugins
gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin); 
```
The NPM files are ES modules, but there's also a /dist/ directory with <a href="https://www.davidbcalhoun.com/2014/what-is-amd-commonjs-and-umd/">UMD</a> files for extra compatibility. Some build tools don't understand ES Modules in which case you can import the UMD files by adding /dist/ like:

```javascript
// UMD imports
import gsap from "gsap-trial/dist/gsap";
import MorphSVGPlugin from "gsap-trial/dist/MorphSVGPlugin";
```

### Use an alias to make upgrading simple
Install the package as a "gsap" alias so that when you join <a href="https://greensock.com/club">Club GreenSock</a> and get the unrestricted files, all you have to do is install those and make zero changes to all your imports!

```javascript
npm install gsap@npm:gsap-trial
```
Now we can simply use "gsap" in place of "gsap-trial", so the imports could look like this:
```javascript
import gsap from "gsap";
import DrawSVGPlugin from "gsap/DrawSVGPlugin";
```


## How do I get unrestricted files?
Once you're a <a href="https://greensock.com/club/">Club GreenSock</a> member, download the unrestricted plugins from your GreenSock.com account and then include them in your own JS payload. There are no "phone home" scripts that track usage and the plugins won't suddenly stop working if/when your membership expires. We treat others the way we'd like to be treated and our entire business model is built on the honor system. Read about it <a href="https://greensock.com/why-license">here</a>. GreenSock has a <a href="https://greensock.com/docs/v3/Installation#private">private NPM registry</a> for members too. 

Post your questions in our <a href="https://greensock.com/forums/">forums</a> and we'd be happy to help.


### Getting Started with GSAP (includes video)

[![Getting Started with GSAP](http://greensock.com/_img/github/thumb-getting-started-small.gif)](http://greensock.com/get-started)

### ScrollTrigger and ScrollSmoother

If you're looking to do scroll-driven animations, GSAP's <a href="https://greensock.com/scrolltrigger">ScrollTrigger</a> plugin is the new standard. There's a companion <a href="https://greensock.com/scrollsmoother">ScrollSmoother</a> as well.

[![ScrollTrigger](http://greensock.com/_img/github/thumb-scrolltrigger-small.gif)](http://greensock.com/scrolltrigger)


### Resources

* <a href="https://greensock.com/">GSAP home page</a>
* <a href="https://greensock.com/get-started/">Getting started guide</a>
* <a href="https://greensock.com/docs/">Docs</a>
* <a href="https://greensock.com/cheatsheet">Cheat sheet</a>
* <a href="https://greensock.com/ease-visualizer">Ease visualizer</a>
* <a href="https://greensock.com/forums/">Forums</a>
* <a href="https://greensock.com/showcase">Showcase</a>
* <a href="https://greensock.com/why-gsap/">Why GSAP?</a> (convince your boss)

### What is Club GreenSock? (video)

[![What is Club GreenSock?](http://greensock.com/_img/github/thumb-what-is-club-greensock-small.jpg)](http://www.youtube.com/watch?v=Ome_KnloOhs)

There are 3 main reasons anyone signs up for <a href="https://greensock.com/club">Club GreenSock</a>:
* To get unrestricted access to the incredibly helpful <a href="https://greensock.com/club">members-only plugins</a> like MorphSVGPlugin, SplitText, etc.
* To get the special <a href="https://greensock.com/licensing/">commercial license</a> ("Business Green" - only necessary if multiple customers are being charged for something that uses GreenSock technology).
* To support ongoing development efforts and **cheer us on**.

What are you waiting for? <a href="https://greensock.com/club/">Sign up</a> today.

### Try bonus plugins for free on CodePen and CodeSandbox

There are instructions and CDN URLs listed at <a href="https://greensock.com/try-plugins">https://greensock.com/try-plugins</a>. CodePen makes it quite simple, as does CodeSandbox.

### Need help?
The <a href="https://greensock.com/forums/">GreenSock forums</a> are an excellent place to learn and get your questions answered. Report any bugs there too please (it's also okay to <a href="https://github.com/greensock/GSAP/issues">file an issue on Github</a> if you prefer).

### License
Please do not use any of the bonus plugins without the proper license which comes with Club GreenSock memberships. GreenSock's standard "no charge" license for the public files can be viewed at <a href="https://greensock.com/standard-license">http://greensock.com/standard-license</a>. <a href="https://greensock.com/club/">Club GreenSock</a> members are granted additional rights. See <a href="https://greensock.com/licensing/">http://greensock.com/licensing/</a> for details. Why doesn't GreenSock use an MIT (or similar) open source license, and why is that a **good** thing? This article explains it all: <a href="https://greensock.com/why-license/" target="_blank">http://greensock.com/why-license/</a>

Copyright (c) 2008-2022, GreenSock. All rights reserved. 