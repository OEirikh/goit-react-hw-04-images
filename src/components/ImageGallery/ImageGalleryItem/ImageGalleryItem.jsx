import React from "react";
import PropTypes from "prop-types";
import s from "./ImageGalleryItem.module.css";

const ImageGalleryItem = ({ img, modalImg, handleTogleModal, tags }) => {
  return (
    <li
      className={s.ImageGalleryItem}
      onClick={({ target: { alt } }) => {
        handleTogleModal(modalImg, alt);
      }}
    >
      <img className={s.ImageGalleryItemImage} src={img} alt={tags} />
    </li>
  );
};

ImageGalleryItem.propTypes = {
  img: PropTypes.string.isRequired,
  modalImg: PropTypes.string.isRequired,
  handleTogleModal: PropTypes.func.isRequired,
  tags: PropTypes.string.isRequired,
};

export default ImageGalleryItem;
