import React from 'react';
import styled from 'styled-components';


const MainDiv = styled.div`
  font-family: arial;

  .modal{
    position: fixed;
    top: 0;
    left: 0;
    width:100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
  }

  .closeButton{
    font-size: 10px;
    position: fixed;
    right: 0px;
    margin-right: 10%;
    color: white;
    font-weight: bold;
  }

  .rowAcrossTop{
    background: rgba(20, 20, 20, 0);
    width: 100%;
    height: 20px;
  }

  .display-block{
    display: block;
  }

  .display-none{
    display: none;
  }

  .modal-main {
    position:fixed;
    background: rgba(20, 20, 20, 0.75);
    z-index: 8;
    width: 80%;
    height: auto;
    top:50%;
    left:50%;
    transform: translate(-50%,-50%);
  }

  .menuTitle {
    text-align: left;
    vertical-align: bottom;
    font-size: 18px;
    color: #333333;
    font-family: verdana;
    font-weight: bold;
  }

  .modalContent {
    margin-left: 10%;
    margin-right: 10%;
    padding: 5%;
    position: relative;
    z-index: 10;
    background: white;
  }
`;

const Modal = ({ handleClose, show, restaurantName }) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  return (
    <MainDiv className={showHideClassName}>
      <section className="modal-main">
        <div className='rowAcrossTop'>
          <div className='closeButton' onClick={handleClose}>Close X</div>
        </div>
        <div className='modalContent'>
          <p className="menuTitle">Menu for {restaurantName[0].toUpperCase() + restaurantName.slice(1)}</p>
          <p>Data</p>
        </div>
      </section>
    </MainDiv>
  );
};

export default Modal;