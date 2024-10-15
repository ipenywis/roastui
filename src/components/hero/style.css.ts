import { style } from '@vanilla-extract/css';

export const hero = style({
  ':before': {
    width: '100%',
    height: '100vh',
    position: 'absolute',
    zIndex: 10,
    content: '',
    backgroundImage: 'url(/dot-pattern.svg)',
    opacity: 0.5,
  },
});
