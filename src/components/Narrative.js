/** @jsx jsx */
import React, { Component } from 'react';
import { css, jsx } from '@emotion/core';
import { Scrollama, Step } from 'react-scrollama';


const narrativeStyle = css`
  .main {
    padding: 60vh 2vw;
    display: flex;
    justify-content: space-between;
  }

  .graphic {
    flex-basis: 50%;
    position: sticky;
    top: 160px;
    width: 100%;
    height: 300px;
    align-self: flex-start;
    background-color: #F0FFFF;
  }

  .data {
    font-size: 5rem;
    text-align: center
  }

  .scroller {
    flex-basis: 30%;
  }

  .step {
    padding-top: 200px;
    padding-bottom: 200px;
    '&:last-child': {
      margin-bottom: 0;
    }
  }
`;

export default class Narrative extends Component {

  state = {
    data: 0,
    steps: [10, 20, 30, 40, 50, 60],
    progress: 0,
  }

  onStepEnter = ({ element, data }) => {
    element.style.backgroundColor = 'lightgoldenrodyellow';
    this.setState( { data });
  }

  onStepExit= ({ element }) => {
    element.style.backgroundColor = '#fff';
  }



  onStepProgress = ({ element, progress }) => {
    this.setState({ progress });
  }

  componentDidMount() {

  }



  render() {
    const { data, steps, progress } = this.state;


    return (
      <div css={narrativeStyle}>
      <div className='main'>
        <div className='graphic'>
          <p className="data">{data}</p>
        </div>
        <div className='scroller'>
          <Scrollama
            onStepEnter={this.onStepEnter}
            onStepExit={this.onStepExit}
            progress
            onStepProgress={this.onStepProgress}
            offset={0.33}
            debug
          >
            {steps.map ( value => (
              <Step data={value} key={value}>
                <div className='step'>
                  <p>step value: {value}</p>
                  <p>{value === data && progress}</p>
                </div>
              </Step>
            ))}
          </Scrollama>
         </div>
      </div>
      </div>
      )
  }
}
