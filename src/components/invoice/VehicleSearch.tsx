
import React from 'react';
import { Car } from 'lucide-react';
import { Input } from "@/components/ui/input";

interface VehicleSearchProps {
  value: string;
  onChange: (value: string) => void;
}

const VehicleSearch: React.FC<VehicleSearchProps> = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <Car className="h-4 w-4 text-gray-500" />
      <Input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Search by Vehicle Number"
        className="max-w-[180px]"
      />
    </div>
  );
};

export default VehicleSearch;
