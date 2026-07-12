interface StatTileProps {
  label: string;
  value: number;
}

const StatTile = ({ label, value }: StatTileProps) => (
  <div className="bg-surface border border-edge rounded-lg p-4 text-center shadow-sm">
    <p className="text-2xl font-bold text-brand">{value}</p>
    <p className="text-xs text-ink-muted mt-1">{label}</p>
  </div>
);

export default StatTile;
