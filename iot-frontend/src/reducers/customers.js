import {
  CREATE_CUSTOMER,
  LOAD_CUSTOMERS,
  REMOVE_CUSTOMER,
  UPDATE_CUSTOMER,
} from "../actions/types";

const initialState = {
  customers: [],
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case LOAD_CUSTOMERS:
      return {
        ...state,
        customers: payload,
      };

    case CREATE_CUSTOMER:
      return {
        ...state,
        customers: [...state.customers, payload],
      };

    case UPDATE_CUSTOMER:
      return {
        ...state,
        customers: state.customers.map((customer) => {
          if (customer.id === payload.id) {
            const updatedCustomer = {
              ...customer,
              ...payload,
            };
            return updatedCustomer;
          }
          return customer;
        }),
      };
    
    case REMOVE_CUSTOMER:
      return {
        ...state,
        customers: state.customers.filter(customer => customer.id !== payload)
      }

    default:
      return state;
  }
}
