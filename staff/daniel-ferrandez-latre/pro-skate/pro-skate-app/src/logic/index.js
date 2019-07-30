import dataApi from "../data";
const {
  validate,
  errors: { LogicError }
} = require("pro-skate-common");

const logic = {
  set __userToken__(token) {
    sessionStorage.userToken = token;
  },

  get __userToken__() {
    return sessionStorage.userToken;
  },

  get isUserLoggedIn() {
    return !!this.__userToken__;
  },

  registerUser(name, surname, email, password, age) {
    validate.arguments([
      { name: "name", value: name, type: "string", notEmpty: true },
      { name: "surname", value: surname, type: "string", notEmpty: true },
      { name: "email", value: email, type: "string", notEmpty: true },
      { name: "password", value: password, type: "string", notEmpty: true },
      { name: "age", value: age, type: "string", notEmpty: true }
    ]);

    validate.email(email);

    return (async () => {
      try {
        await dataApi.createUser(name, surname, email, password, age);
      } catch (err) {
        throw new LogicError(err.message);
      }
    })();
  },

  loginUser(email, password) {
    validate.arguments([
      { name: "email", value: email, type: "string", notEmpty: true },
      { name: "password", value: password, type: "string", notEmpty: true }
    ]);
    validate.email(email);
    return (async () => {
      try {
        this.__userToken__ = await dataApi.authenticate(email, password);
      } catch (err) {
        throw new LogicError(err.message);
      }
    })();
  },

  logOut() {
    sessionStorage.clear();
  },

  retrieveUser() {
    return (async () => {
      try {
        const userDb = await dataApi.retrieveUser(this.__userToken__);
        return userDb;
      } catch (err) {
        throw new LogicError(err.message);
      }
    })();
  },

  updateUser(name, surname, email, password, age) {
    validate.arguments([
      { name: "name", value: name, type: "string", notEmpty: true },
      { name: "surname", value: surname, type: "string", notEmpty: true },
      { name: "email", value: email, type: "string", notEmpty: true },
      { name: "password", value: password, type: "string", notEmpty: true },
      { name: "age", value: age, type: "string", notEmpty: true }
    ]);

    validate.email(email);

    return (async () => {
      try {
        await dataApi.updateUser(name, surname, email, password, age);
      } catch (err) {
        throw new LogicError(err.message);
      }
    })();
  },

  retrieveRandomSelection() {
    return (async () => {
      try {
        return await dataApi.retrieveAllProducts();
      } catch (err) {
        throw new LogicError(err.message);
      }
    })();
  },


  retrieveProduct(productId){
    return ( async () => {
      try {
        return await dataApi.retrieveProduct(productId)
      } catch(err) {
        throw new LogicError(err.message)
      }

    })()
  },

  addProductToCart(token ,productId){
    return ( async () => {
      try {
        const userDb = await dataApi.retrieveUser(token)
        let productUserCart
        if (userDb.cart.length === 0) {
          await dataApi.addProductToCart(token, 1 ,productId)
        } else {
          productUserCart = userDb.cart.find( product => product.productId === productId)
          if(!productUserCart){
            await dataApi.addProductToCart(token, 1 ,productId)
          } else { 
            await dataApi.addProductToCart(token, productUserCart.quantity + 1 ,productId)
          }
        }
      } catch(err) {
        throw new LogicError(err.message)
      }

    })();

  },

  takeOutProductToCart(token ,productId){
    return ( async () => {
      try {
        const userDb = await dataApi.retrieveUser(token)
        let productUserCart
        if (userDb.cart.length > 0) {
          productUserCart = userDb.cart.find( product => product.productId === productId)
          if(productUserCart){
            const quantitySubs = productUserCart.quantity - 1
            await dataApi.addProductToCart(token, quantitySubs ,productId)
          } 
        }
      } catch(err) {
        throw new LogicError(err.message)
      }

    })();

  },

  retrieveCart(){
    return ( async ()=>{
      try{
        const userCart = await dataApi.retrieveCart(logic.__userToken__)
        return userCart
      } catch(err) {
        throw new LogicError(err.message)
      }

    })();
  },

  toggleWhishProduct(productId){
    validate.arguments([
        { name: 'productId', value: productId, type: 'string', notEmpty: true }
    ])
    return ( async ()=>{
      try{
        await dataApi.toggleWhishProduct(logic.__userToken__, productId)
      } catch(err) {
        throw new LogicError(err.message)
      }
    })();
},

retrieveWishList(){
  return ( async ()=>{
    try{
      await dataApi.retrieveWishList(logic.__userToken__)
    } catch(err) {
      throw new LogicError(err.message)
    }
  })();
},

checkoutCart() {
  return (async () => {
    try {
      await dataApi.checkoutCart(this.__userToken__);
    } catch (err) {
      throw new LogicError(err.message);
    }
  })();
},

}
export default logic;
