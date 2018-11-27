import React from 'react';
import $ from 'jquery';
import styled from 'styled-components';

const MainDiv = styled.div`
  display: flex;
  flex-direction: row;
  border-top-style: solid;
  border-top-width: thin;

  .menuItemCol{
    width: 80%;
    font-size: 12px;
    line-height: 1.5em;
  }

  .imgCol{
    width: 10%;
    img {
      width: 80%;
      height: auto;
      padding: 7%;
    }
  }

  .priceCol{
    width: 10%;
    text-align: right;
    position: relative;
    top: 1%;
  }
`;
MainDiv.displayName = 'MainDiv';


const StarIcon = styled.img`
  width: 2.5%;
  height: auto;
`;
StarIcon.displayName = 'StarIcon';


const CameraIcon = styled.img`
  width: 3%;
  height: auto;
  padding-left: 2%;
`;
CameraIcon.displayName = 'CameraIcon';


const MenuItem = ({ menuItem }) => {
  const { dish_price, dish_images, dish_reviews, dish_description } = menuItem;

  let photoWord = 'photos';
  if (dish_images === 1) {
    photoWord = 'photo';
  }
  let reviewsWord = 'reviews';
  if (dish_reviews === 1) {
    reviewsWord = 'review';
  }
  return (
    <MainDiv>
      <div className="menuItemCol imgCol">
        <img src={dish_images[0].url} alt="dish_image" />
      </div>
      <div className="menuItemCol">
        <div><b>{menuItem.dish_name}</b></div>
        <div>{menuItem.dish_description}</div>
        <div className="reviewsAndPhotos">
          <StarIcon src="https://s3.us-east-2.amazonaws.com/yumpsfphotos/small_0%403x.png" alt="reviews icon" />
          {`${dish_reviews.length} ${reviewsWord}`}
          <CameraIcon src="https://s3.us-east-2.amazonaws.com/yumpsfphotos/camericon2.png" alt="camera icon" />
          {`${menuItem.dish_images.length} ${photoWord} `}
        </div>
      </div>
      <div className="menuItemCol priceCol"><b>{`$${dish_price}`}</b></div>
    </MainDiv>
  );
};

export default MenuItem;
