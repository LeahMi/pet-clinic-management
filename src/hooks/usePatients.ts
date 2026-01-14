import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import {
  fetchPatients,
  addPatient,
  editPatient,
  deletePatient,
} from '@/services/patientService'
import { Patient } from '@/types/Patient'

export interface FetchPatientsParams {
  page: number
  search: string
  types: string[]
}

export const usePatients = () => {
  const queryClient = useQueryClient()

  const [page, setPage] = useState<number>(1)
  const [search, setSearch] = useState<string>('')
  const [debouncedSearch, setDebouncedSearch] = useState<string>('')
  const [types, setTypes] = useState<string[]>([])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, types])

  const { data, isLoading, error } = useQuery({
    queryKey: ['patients', page, debouncedSearch, types],
    queryFn: () =>
      fetchPatients(page, debouncedSearch, types ),
    placeholderData: previousData => previousData,
  })

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['patients'] })
  }

  const addMutation = useMutation({
    mutationFn: addPatient,
    onSuccess: invalidate,
  })

  const editMutation = useMutation({
    mutationFn: editPatient,
    onSuccess: invalidate,
  })

  const deleteMutation = useMutation({
    mutationFn: deletePatient,
    onSuccess: invalidate,
  })

  return {
    patients: data?.data ?? [],
    page,
    totalPages: data?.totalPages ?? 1,
    isLoading,
    error,

    setPage,
    search,
    setSearch,
    types,
    setTypes,

    addPatient: addMutation.mutate,
    editPatient: editMutation.mutate,
    deletePatient: deleteMutation.mutate,

    isAdding: addMutation.isPending,
    isEditing: editMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}
