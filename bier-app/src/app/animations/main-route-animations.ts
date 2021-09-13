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

export const slider = trigger('mainRouteAnimations', [
  transition('1 => 2', slideTo('right')),
  transition('2 => 3', slideTo('right')),
  transition('3 => 4', slideTo('right')),
  transition('4 => 5', slideTo('right')),
  transition('1 => 3', slideTo('right')),
  transition('1 => 4', slideTo('right')),
  transition('1 => 5', slideTo('right')),
  transition('2 => 4', slideTo('right')),
  transition('2 => 5', slideTo('right')),
  transition('3 => 5', slideTo('right')),
  transition('5 => 3', slideTo('left')),
  transition('5 => 2', slideTo('left')),
  transition('5 => 1', slideTo('left')),
  transition('4 => 3', slideTo('left')),
  transition('4 => 2', slideTo('left')),
  transition('4 => 1', slideTo('left')),
  transition('3 => 2', slideTo('left')),
  transition('3 => 1', slideTo('left')),
  transition('2 => 1', slideTo('left')),
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
        [animate('300ms ease', style({ [direction]: '100%' }))],
        optional
      ),
      query(':enter', [animate('300ms ease', style({ [direction]: '0%' }))]),
    ]),

    // Required only if you have child animations on the page
    query(':leave', animateChild()),
    query(':enter', animateChild()),
  ];
}
