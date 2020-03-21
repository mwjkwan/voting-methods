/** @jsx jsx */

import { Component } from 'react';
import { jsx, css } from '@emotion/core';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';


const navbarStyle = css`
  .desktop {
    flex-direction: column;
    align-items: right;
    color: #515151;
    position: relative;
    overflow: auto;

    .link {
      margin-right: 1em;
      cursor: pointer;
      line-height: 27px;
      letter-spacing: 0.1em;
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

    .links {
      display: flex;
    }

    .Highlight {
      a {
        font-size: 16px;
        color: #77bbdd;
      }
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

    const parts = pathname.split('/');
    const path = '/' + parts[1] + (parts[2] ? '/' + parts[2] : '');

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
        <div className="Navigation desktop">
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
      text: PropTypes.string.isRequired,
      to: PropTypes.string.isRequired,
    }),
  ).isRequired,
  pathname: PropTypes.string.isRequired,
};
