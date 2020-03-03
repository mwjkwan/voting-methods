/** @jsx jsx */

import React, { Component } from 'react';
import { css, jsx } from '@emotion/core';
import { Link } from 'react-router-dom';

import Description from '../components/Description';
import Article from '../components/Article';

const aboutProject = (
  <div>
    Design and publish a website for exploring and understanding alternative voting methods.
    How do the outcomes of elections change with different numbers of parties of varying popularity under different voting methods?
    What states, cities, and countries are using different voting methods across the globe? What would be the results of past elections
    if done with different kinds of voting methods? Helping people understand the effect that voting has on the way a
    democracy works is critical.
  </div>
);

const content = {
  header: 'About',
};

const aboutStyle = css`
  div {
    font-size: 18px !important;
  }
`;

export default class PageAbout extends Component {
  render() {
    return (
      <Article {...content}>
        <div css={aboutStyle}>
          <Description>{aboutProject}</Description>
        </div>
      </Article>
    );
  }
}
