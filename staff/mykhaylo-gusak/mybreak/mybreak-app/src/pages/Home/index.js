import React, { useState, useEffect } from 'react';
import './index.sass'
import OrderSection from '../../components/OrderSection'
import UserOrder from '../../components/UserOrder'
import Start from '../../components/Start'
import UserMenu from '../../components/UserMenu'
import { CSSTransition } from 'react-transition-group'
import logic from '../../logic'


function Home({ user, orders, setNewOrder, handleUpdateMyOrders, handleAddCard, handleAddOrder, logOut, userMenu, userCard, handleCloseMenu, handleCloseCard, newOrder }) {

    const [products, setProducts] = useState(false)
    const [showError, setErrorMessage] = useState(false)
    const [loader, setLoader] = useState(false)

    const handleProducts = () => {
        return (async () => {
            try {
                setLoader(true)
                const _products = await logic.retrieveAllProducts()
                setProducts(_products)
                setLoader(false)
            } catch (err) {
                setErrorMessage(err.message)
            }
        })()
    }
    const handleResetProducts = () => {
        setProducts(false)
    }
    return (
        <section className='g-Home'>
            {!products && <Start className='g-Home__start' loader={loader} handleProducts={handleProducts} />}
            {user && <UserMenu orders={orders} logOut={logOut} handleCloseMenu={handleCloseMenu} userMenu={userMenu} />}
            {user && < UserOrder user={user} userCard={userCard} handleUpdateMyOrders={handleUpdateMyOrders} handleAddCard={handleAddCard} handleCloseCard={handleCloseCard} handleAddOrder={handleAddOrder} orders={orders} />}
            <CSSTransition
                in={products}
                timeout={600}
                classNames='orderSection'
            >
                <div>
                    {products && <OrderSection setNewOrder={setNewOrder} handleResetProducts={handleResetProducts} loader={loader} card={user.card} products={products} showError={showError} handleAddCard={handleAddCard} handleAddOrder={handleAddOrder} newOrder={newOrder} email={user.email} />}
                </div>
            </CSSTransition >
        </section>
    );
}

export default Home
