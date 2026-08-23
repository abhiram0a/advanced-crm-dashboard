import { customers } from "@/data/customers";
import type { Customer } from "@/types/customer";

export type CreateCustomerInput = Omit<Customer, "id">;

export type UpdateCustomerInput = Partial<
  Omit<Customer, "id">
>;

let customerStore: Customer[] = customers.map((customer) => ({
  ...customer,
}));

const MOCK_API_DELAY = 400;

function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function cloneCustomer(customer: Customer): Customer {
  return {
    ...customer,
  };
}

function cloneCustomers(customerList: Customer[]): Customer[] {
  return customerList.map(cloneCustomer);
}

export async function fetchCustomers(): Promise<Customer[]> {
  await delay(MOCK_API_DELAY);

  return cloneCustomers(customerStore);
}

export async function fetchCustomer(
  customerId: string,
): Promise<Customer> {
  await delay(MOCK_API_DELAY);

  const customer = customerStore.find(
    (item) => item.id === customerId,
  );

  if (!customer) {
    throw new Error("Customer not found.");
  }

  return cloneCustomer(customer);
}

export async function createCustomer(
  input: CreateCustomerInput,
): Promise<Customer> {
  await delay(MOCK_API_DELAY);

  const nextId =
    customerStore.reduce((maxId, customer) => {
      const numericPart = Number(
        customer.id.replace("CUS-", ""),
      );

      return Number.isNaN(numericPart)
        ? maxId
        : Math.max(maxId, numericPart);
    }, 1000) + 1;

  const newCustomer: Customer = {
    id: `CUS-${nextId}`,
    ...input,
  };

  customerStore = [newCustomer, ...customerStore];

  return cloneCustomer(newCustomer);
}

export async function updateCustomer(
  customerId: string,
  input: UpdateCustomerInput,
): Promise<Customer> {
  await delay(MOCK_API_DELAY);

  const customerIndex = customerStore.findIndex(
    (customer) => customer.id === customerId,
  );

  if (customerIndex === -1) {
    throw new Error("Customer not found.");
  }

  const updatedCustomer: Customer = {
    ...customerStore[customerIndex],
    ...input,
    id: customerId,
  };

  customerStore = customerStore.map((customer, index) =>
    index === customerIndex ? updatedCustomer : customer,
  );

  return cloneCustomer(updatedCustomer);
}

export async function deleteCustomer(
  customerId: string,
): Promise<void> {
  await delay(MOCK_API_DELAY);

  const customerExists = customerStore.some(
    (customer) => customer.id === customerId,
  );

  if (!customerExists) {
    throw new Error("Customer not found.");
  }

  customerStore = customerStore.filter(
    (customer) => customer.id !== customerId,
  );
}

export async function updateLastContact(
  customerId: string,
  lastContactDate: string,
): Promise<Customer> {
  return updateCustomer(customerId, {
    lastContactDate,
  });
}