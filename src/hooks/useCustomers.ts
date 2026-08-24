import {
    useMutation,
    useQuery,
    useQueryClient,
  } from "@tanstack/react-query";
  
  import {
    createCustomer,
    deleteCustomer,
    fetchCustomer,
    fetchCustomers,
    updateCustomer,
    updateLastContact,
  } from "@/services/customerService";
  
  import type {
    CreateCustomerInput,
    UpdateCustomerInput,
  } from "@/services/customerService";
  
//   import type { Customer } from "@/types/customer";
  
  import { customerQueryKeys } from "./customerQueryKeys";
  
  export function useCustomers() {
    return useQuery({
      queryKey: customerQueryKeys.list(),
      queryFn: fetchCustomers,
      staleTime: 30_000,
    });
  }
  
  export function useCustomer(customerId: string) {
    return useQuery({
      queryKey: customerQueryKeys.detail(customerId),
      queryFn: () => fetchCustomer(customerId),
      enabled: Boolean(customerId),
    });
  }
  
  export function useCreateCustomer() {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: (input: CreateCustomerInput) =>
        createCustomer(input),
  
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: customerQueryKeys.lists(),
        });
      },
    });
  }
  
  export function useUpdateCustomer() {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: ({
        customerId,
        input,
      }: {
        customerId: string;
        input: UpdateCustomerInput;
      }) => updateCustomer(customerId, input),
  
      onSuccess: (updatedCustomer) => {
        queryClient.setQueryData(
          customerQueryKeys.detail(updatedCustomer.id),
          updatedCustomer,
        );
  
        queryClient.invalidateQueries({
          queryKey: customerQueryKeys.lists(),
        });
      },
    });
  }
  
  export function useDeleteCustomer() {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: (customerId: string) =>
        deleteCustomer(customerId),
  
      onSuccess: (_, customerId) => {
        queryClient.removeQueries({
          queryKey: customerQueryKeys.detail(customerId),
        });
  
        queryClient.invalidateQueries({
          queryKey: customerQueryKeys.lists(),
        });
      },
    });
  }
  
  export function useUpdateLastContact() {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: ({
        customerId,
        lastContactDate,
      }: {
        customerId: string;
        lastContactDate: string;
      }) => updateLastContact(customerId, lastContactDate),
  
      onSuccess: (updatedCustomer) => {
        queryClient.setQueryData(
          customerQueryKeys.detail(updatedCustomer.id),
          updatedCustomer,
        );
  
        queryClient.invalidateQueries({
          queryKey: customerQueryKeys.lists(),
        });
      },
    });
  }