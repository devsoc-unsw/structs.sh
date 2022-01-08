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
