import { useSpring } from '@react-spring/web';
import { slideAnimationConfig } from '@/config/animations';

export function useSlideAnimation(isVisible: boolean) {
  const [styles, api] = useSpring(() => ({
    x: 0,
    config: slideAnimationConfig
  }));

  const slide = (direction: 'left' | 'right') => {
    api.start({
      x: direction === 'right' ? 100 : -100,
      immediate: false
    });
  };

  return { styles, slide };
}