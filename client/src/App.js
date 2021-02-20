import React, { Component } from "react"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Router, Route, Switch } from "react-router-dom"
import LoginPage from "./pages/LoginPage/LoginPage"
import RegistrationPage from "./pages/RegistrationPage/RegistrationPage"
import Payment from "./pages/Payment/Payment"
import StartContestPage from "./pages/StartContestPage/StartContestPage"
import Dashboard from "./pages/Dashboard/Dashboard"
import ContestPage from "./pages/ContestPage/ContestPage"
import UserAccount from "./pages/UserAccount/UserAccount"
import ContestCreationPage from "./pages/ContestCreation/ContestCreationPage"
import RestorePassword from "./pages/RestorePassword/RestorePassword"
import Events from "./pages/Events/Events"
import HowItWorks from "./pages/HowItWorksPage"
import Home from "./pages/Home/Home"
import ChatContainer from "./components/Chat/ChatComponents/ChatContainer/ChatContainer"
import PrivateHoc from "./components/PrivateHoc/PrivateHoc"
import NotFound from "./components/NotFound/NotFound"
import OnlyNotAuthorizedUserHoc from "./components/OnlyNotAuthorizedUserHoc/OnlyNotAuthorizedUserHoc"
import browserHistory from "./browserHistory"
import CONSTANTS from "./constants"

const App = (props) => {
  return (
    <Router history={browserHistory}>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnVisibilityChange
        draggable
        pauseOnHover
      />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/howItWorks" component={HowItWorks} />
        <Route exact path="/login" component={OnlyNotAuthorizedUserHoc(LoginPage)} />
        <Route exact path="/registration" component={OnlyNotAuthorizedUserHoc(RegistrationPage)} />
        <Route exact path="/restorePassword" component={RestorePassword} />
        <Route exact path="/payment" component={PrivateHoc(Payment)} />
        <Route exact path="/startContest" component={PrivateHoc(StartContestPage)} />
        <Route exact path="/startContest/nameContest" component={PrivateHoc(ContestCreationPage, {
          contestType: CONSTANTS.NAME_CONTEST,
          title: "Company Name",
        })} />
        <Route exact path="/startContest/taglineContest" component={PrivateHoc(ContestCreationPage, {
          contestType: CONSTANTS.TAGLINE_CONTEST,
          title: "TAGLINE",
        })} />
        <Route exact path="/startContest/logoContest" component={PrivateHoc(ContestCreationPage, {
          contestType: CONSTANTS.LOGO_CONTEST,
          title: "LOGO",
        })} />
        <Route exact path="/dashboard" component={PrivateHoc(Dashboard)} />
        <Route exact path="/contest/:id" component={PrivateHoc(ContestPage)} />
        <Route exact path="/account" component={PrivateHoc(UserAccount)} />
        <Route exact path="/events" component={PrivateHoc(Events)} />
        <Route component={NotFound} />
      </Switch>
      <ChatContainer controllers={props.controllers} />
    </Router>
  )

}

export default App
