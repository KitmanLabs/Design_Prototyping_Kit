/**
 * Stand-in for @kitman/common/src/variables/colors from the iP monorepo.
 *
 * Maps the monorepo palette names used by playbook-components onto this repo's
 * design tokens (src/styles/design-tokens.css), each holding iP's own value for that
 * name (kitman-frontend packages/common/src/variables/colors.js). A name maps to a
 * semantic token only where that token holds exactly iP's value; otherwise to the
 * --color-ip-* token named after it. Values are CSS custom properties, so they work
 * anywhere CSS accepts a color, but NOT in MUI color helpers such as alpha() or
 * lighten(). For a translucent variant, use withAlpha() below.
 */

/** Translucent version of a token color, e.g. withAlpha('var(--color-primary)', 0.08). */
export const withAlpha = (color, opacity) =>
  `color-mix(in srgb, ${color} ${Math.round(opacity * 100)}%, transparent)`;

export default {
  white: 'var(--color-white)',
  transparent_background: 'transparent',
  light_transparent_background: 'var(--color-ip-light-transparent-background)',

  // Text and selected-state greys
  grey_100: 'var(--color-text-secondary)', // #5f7089
  grey_200: 'var(--color-text-primary)', // #3b4960
  grey_300: 'var(--color-ip-grey-300)',
  grey_100_50: 'var(--color-ip-grey-100-50)',
  grey_200_12: withAlpha('var(--color-text-primary)', 0.12),

  // Surfaces and borders. p06 is white in iP, despite its name.
  neutral_light: 'var(--color-ip-neutral-light)',
  neutral_200: 'var(--color-ip-neutral-200)',
  neutral_300: 'var(--color-ip-neutral-300)',
  neutral_400: 'var(--color-ip-neutral-400)',
  p06: 'var(--color-white)',

  // Status and accent colors
  red_50: 'var(--color-ip-red-50)',
  red_100: 'var(--color-ip-red-100)',
  red_200: 'var(--color-error)', // #b11b27
  green_200: 'var(--color-success)', // #0a875a
  yellow_100: 'var(--color-ip-yellow-100)',
  orange_100: 'var(--color-ip-orange-100)',
  blue_100: 'var(--color-ip-blue-100)',
  teal_100: 'var(--color-ip-teal-100)',
  purple_100: 'var(--color-chart-5)', // #9b58b5
};
