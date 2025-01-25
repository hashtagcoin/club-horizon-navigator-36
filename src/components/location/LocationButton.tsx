interface LocationButtonProps {
  currentCity: string
}

export function LocationButton({ currentCity }: LocationButtonProps) {
  return (
    <h2 className="text-2xl font-bold text-white bg-black cursor-pointer rounded-lg px-3 py-1 shadow-sm inline-block hover:bg-black/90 transition-colors border-4 border-white">
      {currentCity}
    </h2>
  )
}