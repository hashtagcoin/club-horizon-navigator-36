interface SpecialsCardProps {}

export const SpecialsCard = () => {
  return (
    <div
      style={{
        background: 'linear-gradient(to right, #ee9ca7, #ffdde1)',
      }}
      className="p-4 rounded-lg shadow-md text-white"
    >
      <h4 className="font-semibold mb-2">Today's Special</h4>
      <p className="text-sm">2 for 1 on all cocktails before 11 PM!</p>
    </div>
  );
};