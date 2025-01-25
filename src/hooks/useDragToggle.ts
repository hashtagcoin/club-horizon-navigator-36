import { useSpring } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';

export const useDragToggle = (onToggleVisibility: () => void) => {
  const [{ x, y, opacity }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    opacity: 1,
    config: { tension: 280, friction: 60 }
  }));

  const bind = useDrag(({ movement: [mx], active }) => {
    if (!active && Math.abs(mx) > 100) {
      onToggleVisibility();
    }
    api.start({ x: active ? mx : 0, immediate: active });
  }, { axis: 'x' });

  return { x, y, opacity, bind };
};