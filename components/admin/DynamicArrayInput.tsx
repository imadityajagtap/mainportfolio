"use client";

import { X, Plus } from 'lucide-react';

interface DynamicArrayInputProps {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

export default function DynamicArrayInput({
  label,
  values,
  onChange,
  placeholder = 'Enter value',
}: DynamicArrayInputProps) {
  const handleAdd = () => {
    onChange([...values, '']);
  };

  const handleRemove = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, value: string) => {
    const newValues = [...values];
    newValues[index] = value;
    onChange(newValues);
  };

  return (
    <div className="mb-6">
      <label className="text-sm font-medium text-foreground mb-2 block">{label}</label>

      <div className="space-y-2">
        {values.map((value, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={value}
              onChange={(e) => handleChange(index, e.target.value)}
              className="flex-1 px-4 py-3 bg-background border border-foreground/20 rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder={placeholder}
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="p-3 text-foreground/60 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all"
              aria-label="Remove"
            >
              <X size={18} />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleAdd}
        className="mt-3 inline-flex items-center gap-2 px-4 py-2 text-sm text-foreground/70 hover:text-primary hover:bg-foreground/5 rounded-lg transition-all"
      >
        <Plus size={16} />
        Add {label.toLowerCase()}
      </button>
    </div>
  );
}
