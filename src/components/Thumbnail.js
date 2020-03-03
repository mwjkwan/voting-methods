/** @jsx jsx */

import React from 'react';
import { css, jsx } from '@emotion/core';
import { Link } from 'react-router-dom';

const thumbnailStyle = css`
  .Thumbnail {
    background-color: #f3f2ef;
    max-width: 50em;
  }
  .description {
    padding: 0px 15px 15px 15px;
    vertical-align: middle;
    overflow-wrap: break-word;
  }
  .description > h3 {
    margin-top: 0px !important;
  }
  .img-hover-zoom {
    overflow: hidden; /* [1.2] Hide the overflowing of child elements */
  }
  .img-hover-zoom img {
    transition: transform 0.3s ease;
  }
  .img-hover-zoom:hover img {
    transform: scale(1.05);
  }
`;

const Thumbnail = props => {
  const { description, header, image, link, technology, year } = props;
  return (
    <div css={thumbnailStyle}>
      <div className="Thumbnail">
        {image && (
          <Link className="thumbnail-content" to={link}>
            <div className="img-hover-zoom">
              <img
                alt={header}
                src={image || require('assets/empty.png')}
                style={{
                  width: '100%',
                  objectFit: 'cover',
                  marginBottom: 0,
                  minWidth: 125,
                  background: `url(${require('assets/loading.svg')})`,
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                }}
              />
            </div>
          </Link>
        )}
        <div className="thumbnail-content description">
          <Link to={link}>
            <h3>{header}</h3>
          </Link>
          {description && <p>{description}</p>}
          {technology && <p>{technology}</p>}
          {year && <p>{year}</p>}
        </div>
      </div>
    </div>
  );
};

export default Thumbnail;
