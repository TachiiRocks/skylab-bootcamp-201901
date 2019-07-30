import React, { useState, useEffect } from "react";
import {withRouter} from 'react-router-dom'
import logic from "../../logic/index";
import CartItem from "../CartItem"
import Checkout from '../Checkout'
import './index.sass'

function Cart({cartItems, cartItemsQuantity, totalAmount}) {

  const [userMail, setUserMail] = useState('')

    useEffect( () =>{
      async function retrieveEmail(){
        const user = await logic.retrieveUser(logic.__userToken__)
        setUserMail(user.email)

      }
      retrieveEmail()
    },[])


  const handleCheckout = async (token)=>{
    if(token){
      await logic.checkoutCart()
      cartItemsQuantity()
    }
  }
  return(
    <>
    <span className="is-dark  is-size-5"> Total amount: 
    {totalAmount ? totalAmount.toFixed(2) : ''}€</span>
    <ul>
      {cartItems.map((product) =>{
        return( 
          <li>
            <CartItem product={ product } cartItemsQuantity={cartItemsQuantity}/>
          </li>
        )
      })}
    </ul>
    {totalAmount ? <Checkout total={totalAmount} email={userMail} onTokenSuccess={handleCheckout} card={cartItemsQuantity} />: <p> There's no products on your Orders</p>}
    </>
  )

}

export default withRouter(Cart)