const shoppingCart = {
    state: {
      shoppingcartList:[],
    },
  
    mutations: {
      SET_SHOPPINGCART: (state, shoppingcartList) => {
        state.shoppingcartList = shoppingcartList
      }
      
    },
  
    actions: {
    }
  }
  
  export default shoppingCart