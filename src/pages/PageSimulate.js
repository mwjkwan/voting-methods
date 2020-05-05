/** @jsx jsx */

import { Component } from "react";
import { css, jsx } from "@emotion/core";

import Description from "../components/Description";
import Article from "../components/Article";

import SimMap from "../viz/SimMap";
import SimDots from "../viz/SimDots";
import SimLine from "../viz/SimLine";
import SimBar from "../viz/SimBar";
import SimRace from "../viz/SimRace";

const part1 = (
  <div className='desc'>
    We looked at 1 state and 12 American cities that have implemented Ranked Choice Voting (RCV). Across these 13 locales, we covered about 218 contests and 371 seats ranging from school committee elections to the Democratic primary for governorship. The 13 locales come from 8 different states. Across the United States there are a total of 28 distinct regions (ranging from the local to state level) that have implemented Ranked Choice Voting. The cities included in our data sets are those that have done all of the following: digitized their ballot data, have already had at least one election wherein they have implemented Ranked Choice Voting, and include the total number of votes by rank for each candidate or have individual ballots. (Note that in the visualization below, an 'election' is defined by a 'seat' that is being contested in an election, e.g. a city council seat.)
  </div>
);

const part2 = (
  <div className='desc'>
    We looked at elections across the years 2001 to 2019. For each election, we used our complete ballot data to calculate the First Past The Post (FPTP) winner (calculated from the rank 1 votes for each candidate). Then, we noted the elections that saw a <b>different</b> outcome using FPTP than using RCV. We found that <b>24 elections</b> would have turned out differently had the voting system been FPTP rather than RCV. We wanted to see if there were any trends in different outcomes by year, and found that there were no significant patterns here.
  </div>
);

const part3 = (
  <div className='desc'>
    Then, we looked to see if any locales saw a particularly high number of elections that would have turned out differently. We found that Cambridge, Oakland, San Leandro, and San Francisco saw the highest number of elections that would have differed. However, these locales were also some of those that had the most RCV elections out of the locales we looked at. The exception is Minneapolis, which had the 2nd most RCV elections but only had 2 differing election results.
  </div>
);

const part4 = (
  <div className='desc'>
    We wanted to look at various demographic outcomes of utilizing FPTP and RCV as voting systems for each of these locales. First, we looked at the gender of the election winners and how the gender breakdown might change based off of the voting system used. For most of the candidates we had to collect their gender information manually, based off of self-identification. According to our analysis, the largest gender difference of a city’s RCV elected officials to the hypothetical election outcome was 3. In other words, the maximum number of outcome changes that led to a seat that was held by a candidate of one gender to instead belong to a candidate of a different gender was 3. This happened in Oakland, CA and Cambridge, MA. Overall, the switch from RCV to FPTP bore marginal differences in the number of gender discrepancies.
  </div>
)

const part5 = (
  <div className='desc'>
    Due to how complicated it is to identify a person’s race, we were only able to deal with this variable in the datasets that we received from Sarah John. These datasets included the election outcomes for Oakland, CA, San Francisco, CA, San Leandro, CA, and Berkeley, CA. In addition to including the race of many of the candidates of the RCV elections in these cities, they also included the race of the candidates in many election years before RCV was implemented in these cities.
  </div>
)

const part6 = (
  <div className='desc' id='descLast'>
    From this data, we were able to analyze the differences in the total number of candidates with identified races before and after RCV was implemented. In San Leandro, there a total of 25 Asian American, African American, and Latino candidates from 2000 - 2008 (pre-RCV), while there were a total of 12  Asian American, African American, and Latino candidates from 2010 - 2014 (post-RCV). In San Francisco, there were a total of about 233 Asian American, African American, and Latino candidates from 1992 - 2003 (pre-RCV) and 119 from 2004 - 2014 (post-RCV). In Oakland, there were a total of 170 Asian American, African American, and Latino candidates from 2000 - 2008 (pre-RCV), while there were a total of 53 from 2010 - 2014 (post-RCV). In San Leandro, there were a total of 25 Asian American, African American, and Latino candidates from 2000 - 2008 (pre-RCV), while there were a total of 12 from 2010 - 2014 (post-RCV).
  </div>

)

const content = {
  header: "Simulate"
};

const aboutStyle = css`
  div {
    font-size: 18px !important;
  }
  .desc {
    padding-left: 1.5em;
  }
  #descLast {
    padding-top: 0;
  }
  .subheading {
    padding-left: 1.5em;
    padding-top: 1em;
  }
  .big {
    margin-top: 1.5em;
    margin-bottom: 1em;
    margin-left: 2%;
    font-size: 2em !important;
    font-weight: 700;
    color: black;
    line-height: 1;
  }
`;

export default class PageSimulate extends Component {
  render() {
    return (
      <div  css={aboutStyle} >
        <Article>
          <br></br>
          <div className="big">Alternative Outcomes: Case Studies with US Elections</div>
          <div className="subheading">
            <h2>Election Simulation & Data Analysis</h2>
          </div>
          {part1}
          <br></br>
          <SimMap/>
          <div className="subheading">
            <h3>Outcome Discrepancies</h3>
          </div>
          {part2}
          <br></br>
          <SimLine/>
          <br></br>
          {part3}
          <br></br>
          <SimDots/>
          <div className="subheading">
            <h3>Demographic Analysis</h3>
          </div>
          {part4}
          <br></br>
          <SimBar/>
          <br></br>
          {part5}
          {part6}
          <br></br>
          <SimRace/>
        </Article>
      </div>
    );
  }
}
