import {
  ADD_PRODUCT,
  ADD_TO_CART,
  DECREASE_PRODUCT,
  DELETE_PRODUCT,
  GET_PRODUCTS,
  GET_PRODUCT_BY_ID,
} from "./action";

const cartFromLocalStorage = JSON.parse(localStorage.getItem("cart") || "[]");

const initialState = {
  products: [],
  productById: {},
  cart: cartFromLocalStorage,
};

const rootReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_PRODUCTS: {
      return {
        ...state,
        products: payload,
      };
    }
    case GET_PRODUCT_BY_ID: {
      return {
        ...state,
        productById: payload,
      };
    }
    case ADD_PRODUCT: {
      let stockProducto = state.products?.find(
        (e) => e._id === payload
      ).countInStock;

      if (state.cart.length > 0 && state.cart?.find((e) => e.id === payload)) {
        return {
          ...state,
          cart: state.cart.map((e) => {
            if (e.id === payload && e.cantidad < stockProducto) {
              e.cantidad++;
            }
            return e;
          }),
        };
      } else {
        return {
          ...state,
          cart: [...state.cart, { id: payload, cantidad: 1 }],
        };
      }
    }
    case DECREASE_PRODUCT: {
      if (state.cart.find((e) => e.id === payload).cantidad > 1) {
        return {
          ...state,
          cart: state.cart.map((e) => {
            if (e.id === payload) {
              e.cantidad--;
            }
            return e;
          }),
        };
      } else {
        return {
          ...state,
          cart: state.cart.filter((e) => e.id !== payload),
        };
      }
    }
    case DELETE_PRODUCT: {
      return {
        ...state,
        cart: state.cart.filter((e) => e.id !== payload),
      };
    }
    case ADD_TO_CART: {
      let stockProducto = state.products?.find(
        (e) => e._id === payload.id
      ).countInStock;
      if (
        state.cart.length > 0 &&
        state.cart?.find((e) => e.id === payload.id)
      ) {
        return {
          ...state,
          cart: state.cart.map((e) => {
            if (
              e.id === payload.id &&
              e.cantidad + payload.cantidad <= stockProducto
            ) {
              e.cantidad = e.cantidad + payload.cantidad;
            }
            return e;
          }),
        };
      } else {
        return {
          ...state,
          cart: [...state.cart, payload],
        };
      }
    }
    default:
      return state;
  }
};

export default rootReducer;
