import React, { Component } from 'react'
import logic  from '../logic'
import Landing from './Landing'
import Register from './Register'
import Login from './Login'
import HomePE from './HomePE'
import HomeAdmin from './HomeAdmin'
import Profile from './Profile'
import { Route, withRouter, Redirect, Switch } from 'react-router-dom'
import 'uikit/dist/js/uikit.min.js'
import UIkit from 'uikit/dist/js/uikit.min.js'




class App extends Component{

    state = { user: null, error: null , profile: 'product-expert'}
    
    handleRegisterNavigation = () => {
    
        this.setState({ error: null }, () => this.props.history.push('/register'))
            
    }
        
    handleLoginNavigation = () => {

        this.setState({ error: null }, () => this.props.history.push('/login'))
    }

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
            const user = await logic.retrieveUser()
    
            this.setState({ user, profile: user.profile, error: null }, () => this.props.history.push('/home'))
        
        
        } catch (error) {
            
            this.setState({ error: error.message})
        }
    }

    handleLogout = () => {
        logic.logoutUser()

        this.props.history.push('/')
    }

    handleProfileNavigation = () => this.props.history.push('/profile')

    handleUpdateUser = async (name, surname, country)=>{
        try{
            await logic.updateUser(name, surname, country)
            const user = await logic.retrieveUser()
            
            UIkit.notification("<span uk-icon='icon: check'></span> Successfully saved", {status:'success'}, {timeout: 5})
            this.setState({ user})

        }catch(error){
            
            UIkit.notification( error.message, {status:'danger'}, {timeout: 5})

            this.setState({ error: error.message })

        }

    }
    handleComeBack = async () => {
    
        try{

            const user = await logic.retrieveUser()
            this.setState({ user, error: null }, () => this.props.history.push(`/home`))

        } catch(error){
            this.setState({ error: error.message })

        }
    }

    async componentDidMount() {
        if(logic.isUserLoggedIn){

            if(this.props.location.pathname ==='/profile'){
                this.handleProfileNavigation()
            }
            
            try{
                const user = await logic.retrieveUser()
                this.setState({ user, profile: user.profile})
                

            }catch(error){
                this.setState({ error: error.message })
            }

        }

    }


    render(){

        const {
            state: {user, error, profile},
            handleRegisterNavigation,
            handleLoginNavigation,
            handleRegister,
            handleLogin,
            handleLogout,
            handleProfileNavigation,
            handleUpdateUser,
            handleComeBack
        } = this
        
        return <>
                <Switch>
                    <Route exact path="/" render={() => logic.isUserLoggedIn ? <Redirect to="/home" /> : <Landing onRegister={handleRegisterNavigation} onLogin={handleLoginNavigation} />} />
                    <Route path="/register" render={()=> logic.isUserLoggedIn ? <Redirect to="/home" /> : <Register onRegister={handleRegister} error={error} goLogin={handleLoginNavigation}/> }/>
                    <Route path="/login" render={() => logic.isUserLoggedIn  ? (profile ==='product-expert'? <Redirect to="/home" /> : <Redirect to="/homeAdmin" />): <Login onLogin={handleLogin} error={error} goRegister={handleRegisterNavigation}/>} />
                    <Route path="/home" render={() => logic.isUserLoggedIn ? (profile ==='product-expert'? <HomePE user={user} onLogout={handleLogout} goProfile={handleProfileNavigation} /> : <Redirect to="/homeAdmin" />) : <Redirect to="/" />} />
                    {user && <Route path="/profile" render={() => logic.isUserLoggedIn && (profile ==='product-expert') ? <Profile user={user} onReturn={handleComeBack} onUpdate={handleUpdateUser}/> : <Redirect to="/" />} />}
                    <Route path="/homeAdmin" render={() => logic.isUserLoggedIn ?(profile !== 'product-expert'? <HomeAdmin onLogout={handleLogout} error={error}/>: <Redirect to="/home"  />) : <Redirect to="/" />} />
                </Switch>
        </>
    }

}

export default withRouter(App)