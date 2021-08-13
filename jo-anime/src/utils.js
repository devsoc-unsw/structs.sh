import anime from 'animejs'
const CURRENT = "#current"

function resetAnimation() {
    anime({
        targets: CURRENT,
        translateX: 0,
        duration: 10
    })
}

export {resetAnimation}