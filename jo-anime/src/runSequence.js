import anime from 'animejs'


async function runSequence(sequence) {
    const timeline = anime.timeline({
        duration: 250,
        easing: 'easeOutExpo'
    })
    for (const seq of sequence) {
        timeline.add(seq)
    }
    return timeline
}

export default runSequence