/**
 * Stand-in for @kitman/common/src/variables/colors from the iP monorepo.
 *
 * Maps the monorepo palette names used by playbook-components onto this repo's
 * design tokens (src/styles/design-tokens.css). Values are CSS custom properties,
 * so they work anywhere CSS accepts a color, but NOT in MUI color helpers such as
 * alpha() or lighten(). For a translucent variant, use withAlpha() below.
 */

/** Translucent version of a token color, e.g. withAlpha('var(--color-primary)', 0.08). */
export const withAlpha = (color, opacity) =>
  `color-mix(in srgb, ${color} ${Math.round(opacity * 100)}%, transparent)`;

export default {
  white: 'var(--color-white)',
  transparent_background: 'transparent',
  light_transparent_background: 'var(--color-overlay-surface)',

  // Text and selected-state greys
  grey_100: 'var(--color-text-primary)',
  grey_200: 'var(--color-text-secondary)',
  grey_300: 'var(--color-primary)',
  grey_100_50: withAlpha('var(--color-text-primary)', 0.5),
  grey_200_12: withAlpha('var(--color-text-secondary)', 0.12),

  // Surfaces and borders
  neutral_light: 'var(--color-background-secondary)',
  neutral_200: 'var(--color-background-tertiary)',
  neutral_300: 'var(--color-border-primary)',
  neutral_400: 'var(--color-border-secondary)',
  p06: withAlpha('var(--color-primary)', 0.06),

  // Status and accent colors
  red_50: 'var(--color-error-light)',
  red_100: 'var(--color-error)',
  red_200: 'var(--color-error-dark)',
  green_200: 'var(--color-success)',
  yellow_100: 'var(--color-warning)',
  orange_100: 'var(--color-chart-8)',
  blue_100: 'var(--color-info)',
  teal_100: 'var(--color-info-dark)',
  purple_100: 'var(--color-chart-5)',
};
