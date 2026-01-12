import { Table } from "@tanstack/react-table"
import { TextField, Checkbox, FormControlLabel } from "@mui/material"
import { Patient } from "@/types/Patient"
import React from "react"

interface MobileFiltersProps {
  table: Table<Patient>
  selectedTypes: string[]
  setSelectedTypes: React.Dispatch<React.SetStateAction<string[]>>
}

export default function MobileFilters({
  table,
  selectedTypes,
  setSelectedTypes,
}: MobileFiltersProps) {

  const handleType = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    )
  }

  return (
    <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
      <div className="flex flex-col gap-3">

        {/* Search by owner name */}
        <TextField
          size="small"
          label="Search name"
          onChange={(e) =>
            table.getColumn("name")?.setFilterValue(e.target.value)
          }
        />

        {/* Search by pet name */}
        <TextField
          size="small"
          label="Search pet"
          onChange={(e) =>
            table.getColumn("pet.name")?.setFilterValue(e.target.value)
          }
        />

        {/* Pet type filter */}
        <div className="flex justify-between">
          {["dog", "cat", "parrot"].map(type => (
            <FormControlLabel
              key={type}
              control={
                <Checkbox
                  checked={selectedTypes.includes(type)}
                  onChange={() => handleType(type)}
                />
              }
              label={type}
            />
          ))}
        </div>

      </div>
    </div>
  )
}
