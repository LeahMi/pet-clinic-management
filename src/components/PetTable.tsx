import React from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  flexRender,
  SortingState,
  ColumnFiltersState,
  FilterFn,
  Header,
} from '@tanstack/react-table'
import {
  IconButton,
  TextField,
  Popover,
  Checkbox,
  FormControlLabel,
  Button,
  FormGroup,
  InputAdornment,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableCell,
  TableSortLabel,
  TableRow,
  TableBody,
} from '@mui/material'
import {
  Edit,
  Delete,
  ArrowUpward,
  ArrowDownward,
  FilterList,
  Search,
} from '@mui/icons-material'
import { Patient } from '@/types/Patient'

interface PetTableProps {
  data: Patient[]
  onEdit: (patient: Patient) => void
  onDelete: (id: string) => void
}

/* ---------- Filters ---------- */

const petTypeFilter: FilterFn<Patient> = (row, columnId, filterValue) => {
  if (!filterValue || filterValue.length === 0) return true
  return (filterValue as string[]).includes(row.getValue(columnId))
}

const petNameFilter: FilterFn<Patient> = (row, _columnId, filterValue) => {
  if (!filterValue) return true
  const pet = row.original.pet.name?.toLowerCase() || ''
  return pet.includes((filterValue as string).toLowerCase())
}

/* Mobile global filter: name + pet name */
const globalNamePetFilter: FilterFn<Patient> = (row, _columnId, filterValue) => {
  if (!filterValue) return true
  const search = (filterValue as string).toLowerCase()

  const name = row.original.name?.toLowerCase() || ''
  const pet = row.original.pet.name?.toLowerCase() || ''

  return name.includes(search) || pet.includes(search)
}

export default function PetTable({ data, onEdit, onDelete }: PetTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = React.useState('')
  const [petTypeAnchor, setPetTypeAnchor] = React.useState<null | HTMLElement>(
    null
  )
  const [selectedTypes, setSelectedTypes] = React.useState<string[]>([])

  const uniqueTypes = ['dog', 'cat', 'parrot']

  const columns: ColumnDef<Patient>[] = React.useMemo(
    () => [
      {
        id: 'name',
        accessorKey: 'name',
        header: 'Name',
        filterFn: 'includesString',
      },
      {
        id: 'phone',
        accessorKey: 'phone',
        header: 'Phone',
      },
      {
        id: 'pet.name',
        accessorKey: 'pet.name',
        header: 'Pet Name',
        filterFn: petNameFilter,
      },
      {
        id: 'pet.dateOfBirth',
        accessorKey: 'pet.dateOfBirth',
        header: 'Pet DOB',
        cell: ({ getValue }) =>
          new Date(getValue() as string).toLocaleDateString(),
      },
      {
        id: 'pet.type',
        accessorKey: 'pet.type',
        header: 'Pet Type',
        filterFn: petTypeFilter,
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex gap-2">
            <IconButton size="small" onClick={() => onEdit(row.original)}>
              <Edit />
            </IconButton>
            <IconButton size="small" color="error" onClick={() => onDelete(row.original._id)}>
              <Delete />
            </IconButton>
          </div>
        ),
      },
    ],
    []
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: globalNamePetFilter,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: { sorting, columnFilters, globalFilter },
  })

  /* -------- Pet Type filter ---------- */

  React.useEffect(() => {
    const col = table.getAllColumns().find(c => c.id === 'pet.type')
    col?.setFilterValue(selectedTypes.length ? selectedTypes : undefined)
  }, [selectedTypes])

  const renderHeader = (header: Header<Patient, unknown>) => {
    const col = header.column
    const sorted = col.getIsSorted()
    const id = col.id

    const canSort = id === 'name' || id === 'pet.name'
    const canFilter = id === 'name' || id === 'pet.name'

    return (
      <div className="flex flex-col items-center gap-1">
        <div className="flex items-center gap-1">
          <span className="font-semibold">
            {flexRender(col.columnDef.header, header.getContext())}
          </span>

          {canSort && (
            <IconButton
              size="small"
              onClick={() => col.toggleSorting()}
            >
              {sorted === 'asc' ? (
                <svg className="w-4 h-4 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m8 15 4 4 4-4m0-6-4-4-4 4"/></svg>
              ) : sorted === 'desc' ? (
                <svg className="w-4 h-4 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m8 15 4 4 4-4m0-6-4-4-4 4"/></svg>
              ) : (
                <svg className="w-4 h-4 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m8 15 4 4 4-4m0-6-4-4-4 4"/></svg>
              )}
            </IconButton>
          )}

          {id === 'pet.type' && (
            <IconButton size="small" onClick={e => setPetTypeAnchor(e.currentTarget)}>
              <FilterList fontSize="small" />
            </IconButton>
          )}
        </div>

        {canFilter && (
            <div className="hidden md:block">
            <TextField
                size="small"
                sx={{
    '& .MuiInputBase-input': {
      padding: '4px 8px', // הקטנת הריפוד הפנימי
      fontSize: '0.875rem', // הקטנת הטקסט במידת הצורך
    },
  }}
                placeholder="Search"
                value={(col.getFilterValue() as string) || ''}
                onChange={e => col.setFilterValue(e.target.value)}
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="w-full space-y-6">
{/* Mobile search + filter */}
<div className="md:hidden space-y-3">
  <div className="flex items-center gap-2">
    <TextField
      size="small"
      fullWidth
      placeholder="Search by owner or pet name"
      value={globalFilter}
      onChange={e => setGlobalFilter(e.target.value)}
    />

    <IconButton
      onClick={(e) => setPetTypeAnchor(e.currentTarget)}
      className="border"
    >
      <FilterList />
    </IconButton>
  </div>

  {selectedTypes.length > 0 && (
    <div className="text-xs text-gray-600">
      Active: {selectedTypes.join(', ')}
    </div>
  )}
</div>

      {/* TABLE */}
      <div className="hidden md:block p-4 md:p-8 bg-gray-50 min-h-screen">
      {/* טבלה עם פינות מעוגלות ורספונסיביות */}
      <TableContainer component={Paper} className="rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto"> {/* מאפשר גלילה במסכים קטנים */}
          <Table stickyHeader style={{ minWidth: 650 }}>
            <TableHead>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id} className="bg-gray-100">
                  {headerGroup.headers.map(header => (
                    <TableCell key={header.id}>
                      {renderHeader(header)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody>
              {table.getRowModel().rows.map(row => (
                <TableRow key={row.id} hover className="transition-colors">
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </TableContainer>
    </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden flex flex-col gap-4">
        {table.getRowModel().rows.map(row => (
          <div key={row.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
            <div className="font-semibold text-lg text-gray-800 mb-2">{row.original.name}</div>
            <div className="text-gray-600 mb-1"><span className="font-medium">Pet:</span> {row.original.pet.name}</div>
            <div className="text-gray-600 mb-1"><span className="font-medium">Type:</span> <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">{row.original.pet.type}</span></div>
            <div className="text-gray-600 mb-3">
              <span className="font-medium">DOB:</span> {new Date(row.original.pet.dateOfBirth).toLocaleDateString()}
            </div>

            <div className="flex gap-2 justify-end">
              <IconButton size="small" onClick={() => onEdit(row.original)}>
                <Edit />
              </IconButton>
              <IconButton size="small" color="error" onClick={() => onDelete(row.original._id)}>
                <Delete />
              </IconButton>
            </div>
          </div>
        ))}
      </div>

      {/* Pet Type Filter */}
      <Popover
        open={Boolean(petTypeAnchor)}
        anchorEl={petTypeAnchor}
        onClose={() => setPetTypeAnchor(null)}
      >
        <div className="p-4">
          <FormGroup>
            {uniqueTypes.map(t => (
              <FormControlLabel
                key={t}
                control={
                  <Checkbox
                    checked={selectedTypes.includes(t)}
                    onChange={() =>
                      setSelectedTypes(prev =>
                        prev.includes(t)
                          ? prev.filter(x => x !== t)
                          : [...prev, t]
                      )
                    }
                  />
                }
                label={t}
              />
            ))}
          </FormGroup>
        </div>
      </Popover>
    </div>
  )
}
