import React from 'react';
import Sidebar from './components/Sidebar';
import NavigationBar from './pages/NavigationBar';
import PageAbout from './pages/PageAbout';
// import 'styles/styles.scss';

import { Route, Switch } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';

const mql = window.matchMedia(`(min-width: 800px)`);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebarDocked: mql.matches,
      sidebarOpen: false,
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
    const prefix = '';

    return (
      <Router>
        <div className="Page">
          <Sidebar leftSidebar={<NavigationBar />}>
            <Switch>
              <Route exact path={`/`} render={() => <PageAbout />} />
            </Switch>
          </Sidebar>
        </div>
      </Router>
    );
  }
}

export default App;
