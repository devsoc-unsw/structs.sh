import anime from 'animejs'

/**
 * Given an array of animation objects, 'plays' each of them sequentially and returns
 * the anime timeline instance.
 */
function runSequence(sequence) {
    const timeline = anime.timeline({
        duration: 1000,
        easing: 'easeOutExpo'
    })
    for (const seq of sequence) {
        if ('offset' in seq) {
            timeline.add(seq, seq.offset);
        } else {
            timeline.add(seq)
        }
        if ('backlog' in seq) {
            timeline.add({
                complete: seq.backlog.play()
            })
        }
    }
    return timeline
}

export default runSequence