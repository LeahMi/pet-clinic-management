import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import {
  fetchPatients,
  addPatient,
  editPatient,
  deletePatient,
} from "@/services/patientService";

export const usePatients = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [types, setTypes] = useState<string[]>([]);

  const [globalFilter, setGlobalFilter] = useState("");
  const [filters, setFilters] = useState({ ownerName: "", petName: "" });

  const [debouncedParams, setDebouncedParams] = useState({
    global: "",
    owner: "",
    pet: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedParams({
        global: globalFilter,
        owner: filters.ownerName,
        pet: filters.petName,
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [globalFilter, filters]);

  useEffect(() => {
    setPage(1);
  }, [debouncedParams, types]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["patients", page, debouncedParams, types],
    queryFn: () =>
      fetchPatients(
        page,
        debouncedParams.global,
        types,
        debouncedParams.owner,
        debouncedParams.pet,
      ),
    placeholderData: (prev) => prev,
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["patients"] });

  const addMutation = useMutation({
    mutationFn: addPatient,
    onSuccess: invalidate,
  });
  const editMutation = useMutation({
    mutationFn: editPatient,
    onSuccess: invalidate,
  });
  const deleteMutation = useMutation({
    mutationFn: deletePatient,
    onSuccess: invalidate,
  });

  return {
    patients: data?.data ?? [],
    page,
    setPage,
    totalPages: data?.totalPages ?? 1,
    isLoading,
    error,
    globalFilter,
    setGlobalFilter,
    filters,
    setFilters,
    types,
    setTypes,
    addPatient: addMutation.mutate,
    editPatient: editMutation.mutate,
    deletePatient: deleteMutation.mutate,
    isAdding: addMutation.isPending,
    isEditing: editMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
