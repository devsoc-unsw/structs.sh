import { Animation } from './typedefs';
import { Runner } from '@svgdotjs/svg.js'

// this function is for the generation of animation 
// runners to be cleaner
export function generateAnimation(animation: Animation, animationSequence: Runner[]): void {
    const attrs = {};
    
    // TODO: handle special case attributes like dx, dy, etc
    for (const attr in animation.attrs) {
        attrs[attr] = animation.attrs[attr];
    }

    for (let target in animation.targets) {
        animationSequence.push(animation.targets[target].animate(
            animation.duration,
            animation.delay,
            'after').attr(attrs)
        )
    }
}