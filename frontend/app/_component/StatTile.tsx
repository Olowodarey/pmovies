interface StatTileProps {
  label: string;
  value: number;
}

const StatTile = ({ label, value }: StatTileProps) => (
  <div className="border-2 border-gray-800 rounded-md p-4 text-center">
    <p className="text-2xl font-bold">{value}</p>
    <p className="text-xs text-gray-400 mt-1">{label}</p>
  </div>
);

export default StatTile;
