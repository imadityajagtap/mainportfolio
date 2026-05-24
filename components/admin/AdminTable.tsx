"use client";

import { Edit2, Trash2, Package } from 'lucide-react';

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface AdminTableProps {
  columns: Column[];
  data: any[];
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
}

export default function AdminTable({ columns, data, onEdit, onDelete }: AdminTableProps) {
  if (data.length === 0) {
    return (
      <div className="bg-background border border-foreground/10 rounded-2xl overflow-hidden p-12">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-foreground/5 flex items-center justify-center mb-4">
            <Package className="w-8 h-8 text-foreground/40" />
          </div>
          <p className="text-foreground/60 text-lg">No items yet.</p>
          <p className="text-foreground/40 text-sm mt-1">Click + to create your first one.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background border border-foreground/10 rounded-2xl overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-foreground/5 border-b border-foreground/10">
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-4 text-left text-xs font-mono text-foreground/70 uppercase tracking-wider"
              >
                {column.label}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className="px-6 py-4 text-left text-xs font-mono text-foreground/70 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={row._id || row.id || rowIndex}
              className="border-b border-foreground/5 hover:bg-foreground/[0.02] transition-colors"
            >
              {columns.map((column) => (
                <td key={column.key} className="px-6 py-4 text-sm text-foreground">
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center gap-2">
                    {onEdit && (
                      <button
                        type="button"
                        onClick={() => onEdit(row)}
                        className="p-2 text-foreground/60 hover:text-primary hover:bg-foreground/5 rounded-lg transition-all"
                        aria-label="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        type="button"
                        onClick={() => onDelete(row)}
                        className="p-2 text-foreground/60 hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-all"
                        aria-label="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
