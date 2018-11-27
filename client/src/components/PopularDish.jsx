import React from 'react';
import styled from 'styled-components';

const MainDiv = styled.div`
display: flex;
flex-direction: column;
height: 100%;
`;
MainDiv.displayName = 'MainDiv';


const ImageWrapper = styled.div`
  height: 66%;
  position: relative;
  z-index: 0;
`;
ImageWrapper.displayName = 'ImageWrapper';


const Price = styled.div`
  color: white;
  font-weight: bold;
  font-size: 13px;
  background: rgba(20, 20, 20, 0.75);
  font-family: arial;
  width: 23%;
  text-align: center;
  padding: 3px;
  position: absolute;
  right: 3%;
  bottom: 5%;
  z-index: 5;
  border-radius: 3px;
  `;
Price.displayName = 'Price';


const Image = styled.img`
  width: 100%;
  height: 100%;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  border-style: thin;
  border-color: transparent;
  position: relative;
  z-index: 1;
  `;
Image.displayName = 'Image';


const DetailWrapper = styled.div`
  width: 100%;
  height: 34%;
  padding-left: 3%;
  vertical-align: center;
  font-family: arial;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  font-size: 16px;

  .numPhotosReviews {
    color: #666666;
    font-size: 14px;
  }
`;
DetailWrapper.displayName = 'DetailWrapper';

const PopularDish = ({ dish }) => {
  const {
    dish_name,
    dish_price,
    dish_reviews,
    dish_images,
  } = dish;

  let photoWord = 'photos';
  if (dish_images.length === 1) {
    photoWord = 'photo';
  }
  let reviewsWord = 'reviews';
  if (dish_reviews.length === 1) {
    reviewsWord = 'review';
  }

  return (
    <MainDiv>
      <ImageWrapper>
        <Image src={dish_images[0].url} alt="picture of food"></Image>
        <Price>{`$${dish_price}`}</Price>
      </ImageWrapper>
      <DetailWrapper>
        <b>{dish_name}</b>
        <div className="numPhotosReviews">
          {`${dish_images.length} ${photoWord} \u00B7`} {`${dish_reviews.length} ${reviewsWord}`}
        </div>
      </DetailWrapper>
    </MainDiv>
  );
};

export default PopularDish;
