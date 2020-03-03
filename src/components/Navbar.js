/** @jsx jsx */

import { Component } from 'react';
import { jsx, css } from '@emotion/core';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const navbarStyle = css`
  .Navigation {
    display: flex;
    flex-direction: column;
    align-items: right;
    color: #515151;
    position: relative;
    overflow: auto;
    padding: 4em;

    .link {
      margin-bottom: 10px;
      position: relative;
      cursor: pointer;
      line-height: 27px;
      letter-spacing: 0.1em;
      color: #ffffff;
      text-decoration: none;
    }

    a {
      color: #000000;
      font-size: 16px;
      text-decoration: none;
      letter-spacing: 0.1em;

      &:hover {
        text-decoration: none;
      }
    }

    .profile-photo {
      max-width: 100px;
    }

    .Highlight {
      a {
        font-size: 16px;
        font-family: 'Apercu';
        color: #77bbdd;
      }
    }

    .mobile {
      display: inline-block;
    }
  }
`;

const renderLink = (link, path) => {
  const highlight = link.to !== '/' ? path.includes(link.to) : path === '/';
  return (
    <div key={link.text} className={'link' + (highlight ? ' Highlight' : '')}>
      <Link to={link.to}>{link.text}</Link>
    </div>
  );
};

export default class Navbar extends Component {
  renderLinks() {
    const { links, pathname } = this.props;

    var parts = pathname.split('/');
    var path = '/' + parts[1] + (parts[2] ? '/' + parts[2] : '');

    return (
      <div className="links">
        {links.map(link => {
          return renderLink(link, path);
        })}
      </div>
    );
  }

  renderMobile() {
    return (
      <div css={navbarStyle}>
        <div className="Navigation mobile">
          <div className="logo">
            <h1>
              Voting Methods
            </h1>
          </div>
          <div>{this.renderLinks()}</div>
        </div>
      </div>
    );
  }

  renderSide() {
    return (
      <div css={navbarStyle}>
        <div className="Navigation">
          <div className="logo">
            <h1>
              Voting Methods
            </h1>
          </div>
          {this.renderLinks()}
        </div>
      </div>
    );
  }

  render() {
    const { mobile } = this.props;
    return (
      <div css={navbarStyle}>
        {mobile ? this.renderMobile() : this.renderSide()}
      </div>
    );
  }
}

Navbar.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      to: PropTypes.string.isRequired,
    }),
  ).isRequired,
  pathname: PropTypes.string.isRequired,
};
