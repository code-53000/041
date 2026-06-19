import { Volume2, VolumeX } from "lucide-react";

interface VolumeSliderProps {
  volume: number;
  onChange: (volume: number) => void;
  disabled?: boolean;
}

export const VolumeSlider = ({ volume, onChange, disabled = false }: VolumeSliderProps) => {
  const VolumeIcon = volume === 0 ? VolumeX : Volume2;

  return (
    <div className="flex items-center gap-3 w-full">
      <VolumeIcon
        size={16}
        className={`flex-shrink-0 transition-colors duration-300 ${
          disabled ? "text-ambient-600" : "text-ambient-300"
        }`}
      />
      <div className="relative flex-1">
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          className="w-full h-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: `linear-gradient(to right, rgb(45, 212, 191) 0%, rgb(94, 234, 212) ${volume}%, rgba(255,255,255,0.1) ${volume}%, rgba(255,255,255,0.1) 100%)`,
            borderRadius: "9999px",
          }}
        />
      </div>
      <span
        className={`text-xs font-medium w-8 text-right transition-colors duration-300 ${
          disabled ? "text-ambient-600" : "text-ambient-300"
        }`}
      >
        {volume}
      </span>
    </div>
  );
};
