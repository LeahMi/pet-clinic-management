import React from 'react'
import { flexRender, Header } from '@tanstack/react-table'
import {
  IconButton, TextField, Popover, Checkbox, FormControlLabel,
  TableContainer, Paper, Table, TableHead, TableCell, TableRow, TableBody, FormGroup, InputAdornment
} from '@mui/material'
import { Edit, Delete, FilterList, Search } from '@mui/icons-material'
import { Patient } from '@/types/Patient'
import { usePetTable } from '../hooks/usePetTable'

interface PetTableProps {
  data: Patient[]
  onEdit: (patient: Patient) => void
  onDelete: (id: string) => void
  globalFilter: string 
  setGlobalFilter: (val: string) => void
  selectedTypes: string[]
  setSelectedTypes: React.Dispatch<React.SetStateAction<string[]>>
}

export default function PetTable({ 
  data, onEdit, onDelete, globalFilter, setGlobalFilter, selectedTypes, setSelectedTypes 
}: PetTableProps) {
  
  const { table } = usePetTable(data, onEdit, onDelete);
  const [typeAnchor, setTypeAnchor] = React.useState<null | HTMLElement>(null);

  // פונקציה לרינדור כותרת דסקטופ עם חיפוש מובנה
  const renderHeader = (header: Header<Patient, unknown>) => {
    const col = header.column;
    const id = col.id;
    const searchableColumns = ['name', 'pet.name'];

    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-bold text-gray-700">
            {flexRender(col.columnDef.header, header.getContext())}
          </span>
          {id === 'pet.type' && (
            <IconButton size="small" onClick={(e) => setTypeAnchor(e.currentTarget)}>
              <FilterList fontSize="small" color={selectedTypes.length > 0 ? "primary" : "inherit"} />
            </IconButton>
          )}
        </div>
        {searchableColumns.includes(id) && (
          <TextField
            size="small"
            variant="outlined"
            placeholder="Search..."
            value={(col.getFilterValue() as string) || ''}
            onChange={(e) => col.setFilterValue(e.target.value)}
            sx={{ '& .MuiInputBase-input': { py: 0.5, fontSize: '0.75rem' }, backgroundColor: '#fff' }}
          />
        )}
      </div>
    );
  };

  return (
    <div className="w-full space-y-4">
      
      {/* MOBILE: Search Bar + Filter Icon */}
      <div className="md:hidden flex gap-2 items-center px-1">
        <TextField
          fullWidth
          size="small"
          placeholder="Search owner or pet..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ backgroundColor: 'white', borderRadius: '8px' }}
        />
        <IconButton 
          onClick={(e) => setTypeAnchor(e.currentTarget)}
          className="border border-gray-300 rounded-lg"
          sx={{ p: '8px' }}
        >
          <FilterList color={selectedTypes.length > 0 ? "primary" : "inherit"} />
        </IconButton>
      </div>

      {/* DESKTOP TABLE */}
      <TableContainer component={Paper} className="hidden md:block shadow-sm rounded-xl border border-gray-200">
        <Table stickyHeader>
          <TableHead>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableCell key={header.id} className="bg-gray-50">
                    {renderHeader(header)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map(row => (
              <TableRow key={row.id} hover>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* MOBILE CARDS */}
      <div className="md:hidden flex flex-col gap-3">
        {table.getRowModel().rows.map(row => (
          <div key={row.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="font-bold text-gray-900 leading-tight">{row.original.name}</div>
                <div className="flex items-center gap-2">
                   <span className="text-sm font-medium text-blue-600">Pet: {row.original.pet.name}</span>
                   <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full uppercase">{row.original.pet.type}</span>
                </div>
                <div className="text-xs text-gray-600 flex items-center gap-1">
                <span className="font-medium text-gray-500">DOB:</span>
                {new Date(row.original.pet.dateOfBirth).toLocaleDateString('he-IL')}
              </div>
                <div className="text-xs text-gray-400">Phone: {row.original.phone}</div>
              </div>
              <div className="flex gap-1 bg-gray-50 rounded-lg">
                <IconButton size="small" onClick={() => onEdit(row.original)}><Edit fontSize="small" /></IconButton>
                <IconButton size="small" color="error" onClick={() => onDelete(row.original._id)}><Delete fontSize="small" /></IconButton>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* COMMON FILTER POPOVER */}
      <Popover 
        open={Boolean(typeAnchor)} 
        anchorEl={typeAnchor} 
        onClose={() => setTypeAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ sx: { mt: 1, borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' } }}
      >
        <div className="p-3 min-w-[150px]">
          <div className="text-xs font-bold text-gray-400 mb-2 px-1 uppercase tracking-wider">Filter by Type</div>
          <FormGroup>
            {['dog', 'cat', 'parrot'].map(type => (
              <FormControlLabel
                key={type}
                control={
                  <Checkbox 
                    size="small"
                    checked={selectedTypes.includes(type)} 
                    onChange={() => setSelectedTypes(prev => 
                      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
                    )} 
                  />
                }
                label={<span className="text-sm capitalize text-gray-700">{type}</span>}
              />
            ))}
          </FormGroup>
        </div>
      </Popover>
    </div>
  )
}
