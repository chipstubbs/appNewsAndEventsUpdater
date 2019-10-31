/* eslint-disable no-undef */
import React from 'react';
import logo from './logo.svg';
import './App.css';

import { BrowserRouter as Router, Route, NavLink } from "react-router-dom";
import Events from './pages/events';
import ToDO from "./pages/todo";
import { Provider as ReduxProvider } from "react-redux";
import configureStore from "./modules/store";

const reduxStore = configureStore(window.REDUX_INITIAL_DATA);

function App() {
  return (
    
      <ReduxProvider store={reduxStore}>
      <Router>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <nav>
              <ul>
                <li><NavLink activeClassName="selected" to="/news">Newsletter</NavLink></li>
                <li><NavLink activeClassName="selected" to="/events">Events</NavLink></li>
              </ul>
            </nav>
          </header>
        </div>
      

        <Route exact path="/news" component={ToDO} />
        <Route path="/events" component={Events} />
      </Router>
      </ReduxProvider>
  );
}

// function App() {
//   return (
//     <ReduxProvider store={reduxStore}>
//       <div className="App">
//         <header className="App-header">
//           <img src={logo} className="App-logo" alt="logo" />
//           <p>Change Newsletter in App</p>
//         </header>
//         <ToDO />
//       </div>
//     </ReduxProvider>
//   );
// }

export default App;
