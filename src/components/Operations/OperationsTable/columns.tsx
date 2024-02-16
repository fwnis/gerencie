"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export type Operation = {
  statusDaOperacao: 1 | 2 | 3 | 4;
  cliente: string;
  tipoDaOperacao: "FGTS" | "GOV" | "INSS" | "PREFEITURA";
  promotora: string;
  dataDaOperacao: number;
  valorRecebido: number;
  valorLiberado: number;
};

export const columns: ColumnDef<Operation>[] = [
  {
    accessorKey: "statusDaOperacao",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("statusDaOperacao");

      switch (status) {
        case 1:
          return (
            <div className="text-green-600 font-medium flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Sucesso
            </div>
          );
        case 2:
          return (
            <div className="text-yellow-600 font-medium flex items-center">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
              Processando
            </div>
          );
        case 3:
          return (
            <div className="text-orange-600 font-medium flex items-center">
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
              Pendente
            </div>
          );
        case 4:
          return (
            <div className="text-red-600 font-medium flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
              Falha
            </div>
          );
      }
    },
  },
  {
    accessorKey: "cliente",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Cliente
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div className="ml-4">{row.getValue("cliente")}</div>;
    },
  },
  {
    accessorKey: "tipoDaOperacao",
    header: "Tipo",
    cell: ({ row }) => {
      const type: string = row.getValue("tipoDaOperacao");
      return (
        <Badge
          className={
            type == "FGTS"
              ? "bg-sky-600"
              : type == "GOV"
              ? "bg-green-600"
              : type == "INSS"
              ? "bg-yellow-600"
              : "bg-indigo-600"
          }
        >
          {type}
        </Badge>
      );
    },
  },
  {
    accessorKey: "promotora",
    header: "Promotora",
  },
  {
    accessorKey: "dataDaOperacao",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Data da operação
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("dataDaOperacao"));
      const formatted = date.toLocaleDateString("pt-BR");

      return <div className="ml-4">{formatted}</div>;
    },
  },
  {
    accessorKey: "valorRecebido",
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Valor recebido
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("valorRecebido"));
      const formatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(amount);

      return (
        <div className="text-right font-medium mr-4 text-green-600">
          {formatted}
        </div>
      );
    },
  },
  {
    accessorKey: "valorLiberado",
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Valor liberado
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("valorLiberado"));
      const formatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(amount);

      return <div className="text-right font-medium mr-4">{formatted}</div>;
    },
  },
  {
    id: "actions",
    cell: () => {
      return (
        <div className="flex justify-end items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>Copy payment ID</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View customer</DropdownMenuItem>
              <DropdownMenuItem>View payment details</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];