import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Character } from "../types";

export const columns: ColumnDef<Character>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "hit_points",
    header: "HP",
  },
  {
    accessorKey: "strength",
    header: "STR",
  },
  {
    accessorKey: "dexterity",
    header: "DEX",
  },
  {
    accessorKey: "constitution",
    header: "CON",
  },
  {
    accessorKey: "intelligence",
    header: "INT",
  },
  {
    accessorKey: "wisdom",
    header: "WIS",
  },
  {
    accessorKey: "charisma",
    header: "CHA",
  },
];

export default function MonsterTable({ monsters }: { monsters: Character[] }) {
  const table = useReactTable({
    data: monsters,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
