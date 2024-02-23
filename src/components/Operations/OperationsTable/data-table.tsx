"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  PlusCircle,
  X,
} from "lucide-react";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import React from "react";
import NewOperationForm from "@/components/Forms/NewOperationForm";

import { useSearchParams } from "react-router-dom";
import { UserDataProps } from "@/components/Forms/NewOperationTypeForm";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  userData: UserDataProps;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  userData,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      id: false,
    });

  const [searchParams, setSearchParams] = useSearchParams();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnVisibility,
      columnFilters,
    },
    onColumnVisibilityChange: setColumnVisibility,
    columnResizeMode: "onChange",
  });

  return (
    <div>
      <div className="flex items-center justify-between py-2">
        <div className="flex gap-2 items-center">
          <Input
            placeholder="Nome do cliente"
            value={
              (table.getColumn("cliente")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("cliente")?.setFilterValue(event.target.value)
            }
            className="max-w-sm w-64"
          />
          <Select
            value={
              (table
                .getColumn("statusDaOperacao")
                ?.getFilterValue() as string) ?? ""
            }
            onValueChange={(event) =>
              table.getColumn("statusDaOperacao")?.setFilterValue(event)
            }
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Status</SelectLabel>
                <SelectItem value="1">Sucesso</SelectItem>
                <SelectItem value="2">Processando</SelectItem>
                <SelectItem value="3">Pendente</SelectItem>
                <SelectItem value="4">Falha</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select
            value={
              (table.getColumn("tipoDaOperacao")?.getFilterValue() as string) ??
              ""
            }
            onValueChange={(event) =>
              table.getColumn("tipoDaOperacao")?.setFilterValue(event)
            }
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Tipo</SelectLabel>
                {userData &&
                  userData.tiposDeOperacoes.map((tipo) => (
                    <SelectItem value={tipo.name} key={tipo.name + tipo.color}>
                      {tipo.name}
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Button
            variant="link"
            className="p-1 text-red-600 hover:text-red-800"
            onClick={() => {
              table.getColumn("statusDaOperacao")?.setFilterValue("");
              table.getColumn("tipoDaOperacao")?.setFilterValue("");
              table.getColumn("cliente")?.setFilterValue("");
              // setDate(undefined);
            }}
          >
            <X className="h-4 w-4 mr-2 " />
            Limpar filtros
          </Button>
        </div>

        <Dialog
          open={
            searchParams.get("operationModal") &&
            searchParams.get("operationModal") == "true"
              ? true
              : false
          }
        >
          <DialogTrigger asChild>
            <Button onClick={() => setSearchParams({ operationModal: "true" })}>
              <PlusCircle className="w-4 h-4 mr-2" />
              Nova operação
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px]">
            <NewOperationForm />
          </DialogContent>
        </Dialog>
      </div>
      <div className="rounded-md border">
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-16 text-center"
                >
                  Nenhum resultado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div>
        <div className="flex items-center justify-end space-x-2 py-2">
          <span className="text-sm  ml-2 p-0 text-slate-700">
            Página{" "}
            <span className="font-bold">
              {table.getState().pagination.pageIndex + 1} de{" "}
              {table.getPageCount()}
            </span>
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
