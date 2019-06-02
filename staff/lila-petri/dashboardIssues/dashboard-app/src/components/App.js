import React, { Component } from 'react'
import logic  from '../logic'
import Landing from './Landing'
import Register from './Register'
import Login from './Login'
import Home from './Home'
import { Route, withRouter, Redirect, Switch } from 'react-router-dom'

class App extends Component{
    state = { user: null, error: null}
    handleRegisterNavigation = () => this.props.history.push('/register')

    handleLoginNavigation = () => this.props.history.push('/login')

    handleRegister = async (name, surname, email, password, profile, country) => {
        try {
            
            await logic.registerUser(name, surname, email, password, profile, country)
            
            this.setState({ name, error: null }, () => this.props.history.push('/login'))
            
            } catch (error) {
                this.setState({ error: error.message})
            }
        }
    handleLogin = async (email, password) => {
        try {
            await logic.loginUser(email, password)
            const { name } = await logic.retrieveUser()
        
            this.setState({ name, error: null }, () => this.props.history.push('/home'))
        
        } catch ({ message }) {
            this.setState({ error: message })
        }
    }
    handleLogout = () => {
        logic.logoutUser()

        this.props.history.push('/')
    }

    render(){

        const {
            state: {user, error},
            handleRegisterNavigation,
            handleLoginNavigation,
            handleRegister,
            handleLogin,
            handleLogout

        } = this
        return <>
        
        <Switch>
            <Route exact path="/" render={() => logic.isUserLoggedIn ? <Redirect to="/home" /> : <Landing onRegister={handleRegisterNavigation} onLogin={handleLoginNavigation} />} />
            <Route path="/register" render={()=> logic.isUserLoggedIn ? <Redirect to="/home" /> : <Register onRegister={handleRegister} error={error} goLogin={handleLoginNavigation}/> }/>
            <Route path="/login" render={() => logic.isUserLoggedIn ? <Redirect to="/home" /> : <Login onLogin={handleLogin} error={error} goRegister={handleRegisterNavigation}/>} />
            <Route path="/home" render={() => logic.isUserLoggedIn ? <Home name={name} onLogout={handleLogout} /> : <Redirect to="/" />} />

        </Switch>

        </>
    }

}


export default withRouter(App)