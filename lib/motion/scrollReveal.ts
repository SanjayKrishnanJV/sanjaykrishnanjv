import { gsap } from './gsap';

/** Shared "prints in on mount" reveal used across the terminal's views.
 * Terminals don't fade text in — a line is either printed or it isn't — so
 * this is an instant per-item appearance (duration 0) driven entirely by
 * `stagger`, not a fade. */
export function revealOnScroll(
  targets: gsap.TweenTarget,
  vars: gsap.TweenVars = {},
  _trigger?: Element | null
) {
  return gsap.from(targets, {
    opacity: 0,
    duration: 0.06,
    ease: 'none',
    stagger: 0.09,
    ...vars,
  });
}
