/** @jsx jsx */

import { Component } from 'react';
import { css, jsx } from '@emotion/core';

const descriptionStyle = css`
  .description {
    max-width: 50em !important;
    margin-left: 0em;
  }
`;

export default class Description extends Component {
  render() {
    return (
      <div css={descriptionStyle}>
        <div class="description">{this.props.children}</div>
      </div>
    );
  }
}
