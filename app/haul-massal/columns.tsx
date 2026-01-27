"use client"

import { HaulType } from "@/types/haul"
import { ColumnDef } from "@tanstack/react-table"
import ActionsTable from "@/components/actions/actions-table"
import { ReportActions } from "@/components/actions/report-actions"

export const HaulColumns: ColumnDef<HaulType>[] = [
  {
    accessorKey: "no",
    header: "No",
    cell: ({ row }) => {
      return row.original.name ? row.original.no + "." : ""
    },
  },
  {
    accessorKey: "name",
    header: "Nama Pengirim",
  },
  {
    accessorKey: "address",
    header: "Alamat",
  },
  {
    accessorKey: "arwahName",
    header: "Nama Arwah",
    cell: ({ row }) => {
      const idx = row.original.index

      return <>{idx}. {row.original.arwahName}</>
    },

  },
  {
    accessorKey: "arwahAddress",
    header: "Makam",
  },
  {
    id: "actions",
    cell: ({ row }) => {

      return (
        <ReportActions data={row.original} />
      )
    },
  },
]

export const HaulColumnsMobile: ColumnDef<HaulType>[] = [
  {
    accessorKey: "no",
    header: "No",
    cell: ({ row }) => {
      return row.original.name ? row.original.no + "." : ""
    },
  },
  {
    accessorKey: "name",
    header: "Nama Pengirim",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col gap-1">
          <span className="font-medium text-sm">
            {row.original.name}
          </span>
          {row.original.address && (
            <span className="text-xs text-gray-600 leading-relaxed">
              {row.original.address}
            </span>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "arwahName",
    header: "Nama Arwah",
    cell: ({ row }) => {
      return (
        <div className="flex flex-row gap-2">
          <span className="font-medium">{row.original.index}.</span>
          <div className="flex flex-col gap-1">
            <span className="font-medium text-sm">
              {row.original.arwahName}
            </span>
            {row.original.arwahAddress && (
              <span className="text-xs text-gray-600 leading-relaxed">
                {row.original.arwahAddress}
              </span>
            )}
          </div>
        </div>

      )
    },
  },
]

export const HaulColumnsDashboard: ColumnDef<HaulType>[] = [
  {
    accessorKey: "no",
    header: "No",
    cell: ({ row }) => {
      return row.original.isMainRow ? row.original.no + "." : ""
    },
  },
  {
    accessorKey: "name",
    header: "Nama Pengirim",
    cell: ({ row }) => {
      return row.original.isMainRow ? row.original.name : ""
    }
  },
  {
    accessorKey: "address",
    header: "Alamat",
    cell: ({ row }) => {
      return row.original.isMainRow ? row.original.address : ""
    }
  },
  {
    accessorKey: "arwahName",
    header: "Nama Arwah",
    cell: ({ row }) => {
      const idx = row.original.index

      return <>{idx}. {row.original.arwahName}</>
    },

  },
  {
    accessorKey: "arwahAddress",
    header: "Makam",
  },
  {
    id: "actions",
    cell: ({ row }) => {

      return (
        <ActionsTable data={row.original} />
      )
    },
  },
]

export const HaulColumnsMobileDashboard: ColumnDef<HaulType>[] = [
  {
    accessorKey: "no",
    header: "No",
    cell: ({ row }) => {
      return row.original.name ? row.original.no + "." : ""
    },
  },
  {
    accessorKey: "name",
    header: "Nama Pengirim",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col gap-1">
          <span className="font-medium text-sm">
            {row.original.name}
          </span>
          {row.original.address && (
            <span className="text-xs text-gray-600 leading-relaxed">
              {row.original.address}
            </span>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "arwahName",
    header: "Nama Arwah",
    cell: ({ row }) => {
      return (
        <div className="flex flex-row gap-2">
          <span className="font-medium">{row.original.index}.</span>
          <div className="flex flex-col gap-1">
            <span className="font-medium text-sm">
              {row.original.arwahName}
            </span>
            {row.original.arwahAddress && (
              <span className="text-xs text-gray-600 leading-relaxed">
                {row.original.arwahAddress}
              </span>
            )}
          </div>
        </div>

      )
    },

  },
  {
    id: "actions",
    cell: ({ row }) => {


      return (
        <ActionsTable data={row.original} />

      )
    },
  },

]

