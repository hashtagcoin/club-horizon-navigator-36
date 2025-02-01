import { useSpring } from '@react-spring/web';
import { cardAnimationConfig } from '@/config/animations';

export function useCardAnimation(isVisible: boolean) {
  const [styles, api] = useSpring(() => ({
    x: 0,
    y: 0,
    opacity: 1,
    config: cardAnimationConfig
  }));

  const animate = (show: boolean) => {
    api.start({
      x: show ? 0 : 100,
      y: show ? 0 : -50,
      opacity: show ? 1 : 0,
      immediate: false
    });
  };

  return { styles, animate };
}