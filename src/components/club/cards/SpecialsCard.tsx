import { animated } from '@react-spring/web';

interface SpecialsCardProps {
  bindSpecials: () => any;
  specialsX: any;
}

export const SpecialsCard = ({ bindSpecials, specialsX }: SpecialsCardProps) => {
  return (
    <animated.div
      {...bindSpecials()}
      style={{
        x: specialsX,
        background: 'linear-gradient(to right, #ee9ca7, #ffdde1)',
      }}
      className="p-4 rounded-lg shadow-md text-white cursor-grab active:cursor-grabbing"
    >
      <h4 className="font-semibold mb-2">Today's Special</h4>
      <p className="text-sm">2 for 1 on all cocktails before 11 PM!</p>
    </animated.div>
  );
};