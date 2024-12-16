import { useState } from 'react';
import { useSpring } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';

export const useListState = () => {
  const [isListCollapsed, setIsListCollapsed] = useState(false);
  const [{ x }, api] = useSpring(() => ({ x: 0 }));

  const toggleList = () => {
    setIsListCollapsed(!isListCollapsed);
    api.start({ 
      x: !isListCollapsed ? -window.innerWidth * 0.5 + 40 : 0,
      immediate: false,
      config: { tension: 200, friction: 25 }
    });
  };

  const bind = useDrag(({ movement: [mx], direction: [dx], cancel, active }) => {
    if (active && Math.abs(mx) > window.innerWidth * 0.15) {
      cancel();
      const shouldCollapse = dx < 0;
      setIsListCollapsed(shouldCollapse);
      api.start({ 
        x: shouldCollapse ? -window.innerWidth * 0.5 + 40 : 0, 
        immediate: false,
        config: { tension: 200, friction: 25 }
      });
    } else {
      api.start({ 
        x: active ? mx : isListCollapsed ? -window.innerWidth * 0.5 + 40 : 0, 
        immediate: active,
        config: { tension: 200, friction: 25 }
      });
    }
  }, {
    axis: 'x',
    bounds: { left: -window.innerWidth * 0.5 + 40, right: 0 },
    rubberband: true,
    from: () => [x.get(), 0]
  });

  return {
    isListCollapsed,
    x,
    bind,
    toggleList
  };
};