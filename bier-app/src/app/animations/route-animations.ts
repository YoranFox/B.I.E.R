import {
  trigger,
  transition,
  style,
  query,
  group,
  animateChild,
  animate,
  keyframes,
} from '@angular/animations';

export const slider = trigger('routeAnimations', [
  transition('main => top', slideTo('left')),
  transition('main => bottom', slideTo('left')),
  transition('bottom => top', slideTo('top')),
  transition('top => bottom', slideTo('bottom')),
  transition('bottom => main', slideTo('right'))
]);

function slideTo(direction: string) {
  const optional = { optional: true };
  let anchorDirection = 'top'; 
  switch(direction) {
    case 'bottom':
    case 'top':
      anchorDirection = 'left';
      break;
    case 'right':
    case 'left':
      anchorDirection = 'top';
      break;
  }
  

  return [
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          [direction]: 0,
          [anchorDirection]: 0,
          width: '100%',
        }),
      ],
      optional
    ),
    query(':enter', [style({ [direction]: '-100%' })]),
    group([
      query(
        ':leave',
        [animate('600ms ease', style({ [direction]: '100%' }))],
        optional
      ),
      query(':enter', [animate('600ms ease', style({ [direction]: '0%' }))]),
    ]),

    // Required only if you have child animations on the page
    query(':leave', animateChild()),
    query(':enter', animateChild()),
  ];
}
