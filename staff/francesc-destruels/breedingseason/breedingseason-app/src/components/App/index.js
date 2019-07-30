import React, { useState, useEffect, Fragment } from 'react'
import { Route, withRouter, Redirect, Switch } from 'react-router-dom'
import { AppContext } from '../AppContext'
import Login from '../Login'
import Register from '../Register'
import Landing from '../Landing'
import Home from '../Home'
import logic from '../../logic'
import './index.sass'

function App({ history }) {

  const [feedback, setFeedback] = useState(null)
  const [Nickname, setNickname] = useState({})


  useEffect(() => {
    logic.isUserLoggedIn && logic.retrieveUser()
      .then(user => setNickname(user))
  }, [])

  const handleSignUp = (nickname, age, email, password) => {
    try {
      logic.registerUser(nickname, age, email, password)
        .then(() => {
          setFeedback(null)
          history.push('/login')
        })
        .catch(({ message }) => {
          setFeedback(message)
        })
    } catch ({ message }) {
      setFeedback(message)
    }
  }

  const handleLogIn = (nicknameOEmail, password) => {
    try {
      logic.loginUser(nicknameOEmail, password)
        .then(() => logic.retrieveUser())
        .then(user => setNickname(user))
        .then(() => {
          setFeedback(null)
        })
        .then(() => history.push('/home'))
        .catch(({ message }) => {
          setFeedback(message)
        })
    } catch ({ message }) {
      setFeedback(message)
    }
  }

  const handleToLogin = () => {
    setFeedback(null)
    history.push('/login')
  }

  const handleToRegister = () => {
    setFeedback(null)
    history.push('/register')
  }

  return (
    <Fragment>
      <div className="App App__Pages">
        <AppContext.Provider value={{ Nickname, setNickname, feedback }}>
          <Switch>
            <Route exact path='/' render={() => !logic.isUserLoggedIn ? <Landing toLogin={handleToLogin} toRegister={handleToRegister} /> : <Redirect to='/home' />} />
            <Route path='/login' render={() => !logic.isUserLoggedIn ? <Login onLogin={handleLogIn} /> : <Redirect to='/home' />} />
            <Route path='/register' render={() => !logic.isUserLoggedIn ? <Register onSignUp={handleSignUp} /> : <Redirect to='/home' />} />
            <Route path='/home' render={() => logic.isUserLoggedIn ? <Home /> : <Redirect to='/' />} />
            <Route render={() => <Redirect to="/" />} />
          </Switch>
        </AppContext.Provider>
      </div>
      {<div className="App App__Pages--BadResolution">
          <p>This game requires at least 1024px of resolution to play! Sorry!</p>
      </div>}
    </Fragment>
  )

}

export default withRouter(App)