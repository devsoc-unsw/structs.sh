import { getArcD, getFlatArcD, getArcTipTransform, convertToLongPointer, getLongPointerTailLength, getLongPointerTipTransform, getTransformValue, getOffsetDistance, convertToArc, getShortPointerLength, getPointerTipHeight } from './linkedListDrawingUtil';
import anime from 'animejs';

// generates an animation timeline based on animation instructions
// stored in global variable
export function createAnimation(list, animationSequence) {
    const { nodes } = list;
    let offset = 0;
    const animation = anime.timeline();
    animationSequence.forEach((frame, i) => {
        offset += frame.delay
        switch (frame.action) {
            case 'highlight':
                // highlight node without transition
                animation.add({
                    targets: frame.targets,
                    fill: [
                        { value: '#000000', duration: 5 },
                        { value: '#ff0000', duration: frame.duration - 5 },
                        { value: '#000000', duration: 0 }
                    ],
                    stroke: [
                        { value: '#000000', duration: 5 },
                        { value: '#ff0000', duration: frame.duration - 5 },
                        { value: '#000000', duration: 0 }
                    ],
                    easing: 'steps(1)'
                }, offset);
                break;
            case 'fadeIn':
                animation.add({
                    targets: frame.targets,
                    opacity: [
                        { value: 0, duration: 5 },
                        { value: 1, duration: frame.duration - 5 }
                    ],
                    easing: 'linear'
                }, offset);
                break;
            case 'fadeOut':
                animation.add({
                    targets: frame.targets,
                    opacity: [{ value: 0, duration: frame.duration }],
                    easing: 'linear',
                    changeComplete: function () {
                        // clean up svgs from dom
                        console.log("DISAPPEARING");
                        frame.targets.forEach(el => el.remove());
                    }
                }, offset);
                break;
            case 'appear':
                // appear on screen without transition
                animation.add({
                    targets: frame.targets,
                    opacity: [
                        { value: 0, duration: 5 },
                        { value: 1, duration: frame.duration - 5 }
                    ],
                    easing: 'steps(1)'
                }, offset);
                break;
            case 'disappear':
                // disappear from screen without transition
                animation.add({
                    targets: frame.targets,
                    opacity: [
                        { value: 1, duration: 5 },
                        { value: 0, duration: frame.duration - 5 }
                    ],
                    easing: 'steps(1)',
                    changeComplete: function () {
                        // clean up svgs from dom
                        frame.targets.forEach(el => el.remove());
                    }
                }, offset)
                break;
            case 'shiftLeft':
                // shift all nodes and pointers to the left
                console.log('SHIFTING LEFT');
                animation.add({
                    targets: frame.targets,
                    transform: function (el) {
                        const currentTransform = getTransformValue(el);
                        return `translate(${currentTransform[0] - getOffsetDistance(nodes)}, `
                            + `${currentTransform[1]})`;
                    },
                    easing: 'linear'
                }, offset)
                break;
            case 'drawArc':
                // 'draw' arc by hiding the straight pointer tail and displaying
                // curved pointer tail
                // TODO: add a animation that draws the arc, and allows the
                // tip to follow the path it traces while it's being drawn
                animation.add({
                    changeBegin: function () {
                        convertToArc(frame.targets[0], nodes)
                    },
                }, offset);
                break;
            case 'flattenArc':
                // flatten tail by increasing radius
                animation.add({
                    targets: frame.targets[0].childNodes[0],
                    d: [
                        { value: getArcD(nodes), duration: 5 },
                        { value: getFlatArcD(nodes), duration: frame.duration - 5 }
                    ],
                    easing: function () {
                        return function (t) {
                            // initially slow, then speeds up
                            return Math.pow(t, 5);
                        };
                    },
                }, offset);

                // rotate tip while arc flattens
                animation.add({
                    targets: frame.targets[0].childNodes[2],
                    transform: [
                        { value: getArcTipTransform(nodes), duration: 5 },
                        { value: getLongPointerTipTransform(nodes), duration: frame.duration - 5 }
                    ],
                    easing: 'linear',
                    changeComplete: function () {
                        // once animation finishes, the curved tail is hidden and the straight tail
                        // is displayed
                        convertToLongPointer(frame.targets[0], nodes)
                    }
                }, offset);
                break;
            case 'shorten':
                // shorten a long pointer
                animation.add({
                    targets: frame.targets[0].childNodes[1],
                    x2: [
                        { value: getLongPointerTailLength(nodes), duration: 5 },
                        { value: getShortPointerLength(nodes) - getPointerTipHeight(nodes), duration: frame.duration - 5 }
                    ],
                    duration: frame.duration,
                    easing: 'linear'
                }, offset);

                // move pointer while tail shortens
                animation.add({
                    targets: frame.targets[0].childNodes[2],
                    duration: frame.duration,
                    transform: [{ value: getLongPointerTipTransform(nodes), duration: 5 }, { value: 'translate(0, 0)', duration: frame.duration - 5 }],
                    easing: 'linear'
                }, offset);
                break;
            default:
                alert("unkown instruction");
        }
    })
    return animation;
}