import {
  CREATE_TENANT,
  LOAD_TENANTS,
  REMOVE_TENANT,
  UPDATE_TENANT,
} from "../actions/types";

const initialState = {
  tenants: [],
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case LOAD_TENANTS:
      return {
        ...state,
        tenants: payload,
      };

    case CREATE_TENANT:
      return {
        ...state,
        tenants: [...state.tenants, payload],
      };

    case UPDATE_TENANT:
      return {
        ...state,
        tenants: state.tenants.map((tenant) => {
          if (tenant.id === payload.id) {
            const updatedTenant = {
              ...tenant,
              ...payload,
            };
            return updatedTenant;
          }
          return tenant;
        }),
      };
    
    case REMOVE_TENANT:
      return {
        ...state,
        tenants: state.tenants.filter(tenant => tenant.id !== payload)
      }

    default:
      return state;
  }
}
