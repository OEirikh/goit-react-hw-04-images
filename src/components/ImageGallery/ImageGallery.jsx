import React from "react";
import PropTypes from "prop-types";
import s from "./ImageGallery.module.css";
import ImageGalleryItem from "./ImageGalleryItem/ImageGalleryItem";

const ImageGallery = ({ images, handleTogleModal }) => {
  return (
    <ul className={s.ImageGallery}>
      {images.map(({ webformatURL, id, largeImageURL, tags }) => (
        <ImageGalleryItem
          handleTogleModal={handleTogleModal}
          key={id}
          img={webformatURL}
          modalImg={largeImageURL}
          tags={tags}
        />
      ))}
    </ul>
  );
};

ImageGallery.propTypes = {
  images: PropTypes.array.isRequired,
  handleTogleModal: PropTypes.func.isRequired,
};

export default ImageGallery;
