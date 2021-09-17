import anime, { AnimeTimelineInstance } from 'animejs';
import { Animation } from './typedefs';

/**
 * Given an array of animation objects, 'plays' each of them sequentially and returns
 * the anime timeline instance.
 */
const runSequence = (sequence: Animation[]): AnimeTimelineInstance => {
    const timeline = anime.timeline({
        duration: 1000,
        easing: 'easeOutExpo',
    });
    for (const seq of sequence) {
        timeline.add(seq);
    }
    return timeline;
};

export default runSequence;
