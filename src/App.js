import React from "react";
import NavigationBar from "./pages/NavigationBar";
import PageAbout from "./pages/PageAbout";
import PageHome from "./pages/PageHome";
import PageDistribution from "./pages/PageDistribution";
import PageMethods from "./pages/PageMethods";
import PageOverview from "./pages/PageOverview";
import PageSimulate from "./pages/PageSimulate";
import ScrollToTop from './components/ScrollToTop'
import "bootstrap/dist/css/bootstrap.min.css";
import "../src/styles/styles.scss";

import { Route, Switch } from "react-router-dom";
import { BrowserRouter as Router } from "react-router-dom";

const mql = window.matchMedia(`(min-width: 800px)`);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebarDocked: mql.matches,
      sidebarOpen: false
    };

    this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
    this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
  }

  componentWillMount() {
    mql.addListener(this.mediaQueryChanged);
  }

  componentWillUnmount() {
    this.state.mql.removeListener(this.mediaQueryChanged);
  }

  onSetSidebarOpen(open) {
    this.setState({ sidebarOpen: open });
  }

  mediaQueryChanged() {
    this.setState({ sidebarDocked: mql.matches, sidebarOpen: false });
  }

  render() {
    return (
      <Router>
          <div className="Page">
            <NavigationBar />
            <ScrollToTop>
            <Switch>
              <Route exact path={`/`} render={() => <PageHome />} />
              <Route exact path={`/#/overview`} render={() => <PageOverview />} />
              <Route exact path={`/#/distribution`} render={() => <PageDistribution />} />
              <Route exact path={`/#/simulate`} render={() => <PageSimulate />} />
              <Route exact path={`/#/methods`} render={() => <PageMethods />} />
              <Route exact path={`/#/about`} render={() => <PageAbout />} />
            </Switch>
            </ScrollToTop>
          </div>
      </Router>
    );
  }
}

export default App;
