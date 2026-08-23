export const customerQueryKeys = {
    all: ["customers"] as const,
  
    lists: () => [...customerQueryKeys.all, "list"] as const,
  
    list: () => [...customerQueryKeys.lists()] as const,
  
    details: () => [...customerQueryKeys.all, "detail"] as const,
  
    detail: (customerId: string) =>
      [...customerQueryKeys.details(), customerId] as const,
  };