import { v4 as getUuid } from 'uuid';
import anime from 'animejs';
const CURRENT = '#current';

export const resetAnimation = () => {
    anime({
        targets: CURRENT,
        translateX: 0,
        duration: 10,
    });
};

/* -------------------------------------------------------------------------- */
/*                             SVG Drawing Helpers                            */
/* -------------------------------------------------------------------------- */

/**
 * Helper function which sets multiple attributes at once
 */
export const setAttributes = (elements, attributes) => {
    for (const key in attributes) {
        elements.setAttribute(key, attributes[key]);
    }
};

/**
 * Helper function which sets multiple attributes at once
 */
export const genId = (): string => {
    return String(getUuid());
};
