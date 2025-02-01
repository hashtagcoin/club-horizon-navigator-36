import { Club } from '@/types/club';
import { Card } from '@/components/ui/card';
import { useCardAnimation } from '@/hooks/animation/useCardAnimation';
import { animated } from '@react-spring/web';

interface MainDetailsCardProps {
  club: Club;
  selectedDay: string;
  onShare: () => void;
}

export function MainDetailsCard({ club, selectedDay, onShare }: MainDetailsCardProps) {
  const { styles } = useCardAnimation(true);

  return (
    <animated.div style={styles}>
      <Card className="bg-white shadow-lg p-4">
        <h3 className="text-lg font-semibold mb-2">{club.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{club.address}</p>
        <div className="text-sm">
          <span className="font-medium">Hours: </span>
          {club.openingHours[selectedDay]}
        </div>
        <button
          onClick={onShare}
          className="mt-2 text-sm text-blue-600 hover:text-blue-800"
        >
          Share
        </button>
      </Card>
    </animated.div>
  );
}