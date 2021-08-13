import anime from 'animejs'


async function runSequence(sequence) {
    const timeline = anime.timeline({
        duration: 250,
        easing: 'easeOutExpo'
    })
    for (const seq of sequence) {
        timeline.add(seq)
        if ('backlog' in seq) {
            timeline.add({
                complete: seq.backlog.play()
            })
        }
    }
    return timeline
}

export default runSequence