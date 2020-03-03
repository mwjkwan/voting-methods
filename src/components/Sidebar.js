/** @jsx jsx */

import React, { Component } from 'react';
import { css, jsx } from '@emotion/core';
import ReactDom from 'react-dom';
import { withRouter } from 'react-router';

import Sidebar from 'react-sidebar';

const leftSidebar = 250;
const center = 400;

const sidebarStyle = css`
  .SidebarContent {
    text-align: left;
    padding: 20px;
    min-width: 300px;
    min-height: 90%;
    position: relative;

    .Navbar {
      position: fixed;
      z-index: 100;
      top: 0;
      left: 0;
      padding: 10px 20px;
      // border-bottom: 1px solid rgb(243, 243, 243);
      background: white;
      display: flex;
      width: 100%;
      justify-content: space-between;
    }
  }

  .Sidebar {
    text-align: right;
    overflow: visible;

    a {
      font-family: 'Apercu-light';
      letter-spacing: 1px;
    }

    div {
      font-family: 'Apercu-light';
      letter-spacing: 1px;
    }
  }

  .centered-mobile {
    text-align: center !important;
    .Navigation {
      padding: 2em;
    }
    .link {
      margin-bottom: 5px !important;
    }
  }
`;

class MySidebar extends Component {
  constructor(props) {
    super(props);
    this.state = { width: 0, height: 0 };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.myRef = React.createRef();
    this.state = {
      leftSidebarOpen: false,
      leftSidebarDocked: true,
      transitions: false,
    };
  }

  updateWindowDimensions() {
    this.setState(state => {
      return {
        width: window.innerWidth,
        height: window.innerHeight,
        leftSidebarDocked: window.innerWidth > leftSidebar + center,
        leftSidebarOpen:
          window.innerWidth > leftSidebar + center
            ? false
            : state.leftSidebarOpen,
      };
    });
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
    this.timer = setTimeout(() => this.setState({ transitions: true }), 100);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
    window.clearTimeout(this.timer);
  }

  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      ReactDom.findDOMNode(this.myRef.current).scrollIntoView();
    }
  }

  renderMobile() {
    return <div className="centered-mobile">{this.props.leftSidebar}</div>;
  }

  renderSidebarContent() {
    const mobile = !this.state.leftSidebarDocked;
    return (
      <div
        style={{
          padding: mobile ? 0 : '2em',
        }}
      >
        {mobile && this.renderMobile()}
        <div
          style={{
            marginTop: mobile ? 0 : 10,
            padding: mobile ? '1.5em' : 0,
            height: mobile ? 'calc(100% - 45px)' : 'auto',
            overflowY: mobile ? 'auto' : 'hidden',
            overflowX: 'hidden',
            position: 'relative',
          }}
        >
          {this.props.children}
        </div>
      </div>
    );
  }

  render() {
    return (
      <div css={sidebarStyle}>
        <Sidebar
          transitions={this.state.transitions}
          sidebar={
            <div
              onClick={() => this.setState({ leftSidebarOpen: false })}
              style={{ height: 'calc(100% - 30px)' }}
            >
              {this.props.leftSidebar}
            </div>
          }
          open={this.state.leftSidebarOpen}
          docked={this.state.leftSidebarDocked}
          onSetOpen={open => this.setState({ leftSidebarOpen: open })}
          styles={{
            sidebar: { width: leftSidebar, zIndex: 201, overflowY: 'auto' },
            root: { width: '100%' },
          }}
          sidebarClassName={'Sidebar'}
          shadow={false}
        >
          <div ref={this.myRef} />
          {this.renderSidebarContent()}
        </Sidebar>
      </div>
    );
  }
}

export default withRouter(MySidebar);
