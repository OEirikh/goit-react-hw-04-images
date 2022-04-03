import React from "react";
import PropTypes from "prop-types";
import s from "./Button.module.css";

const Button = ({ handleLoadMore }) => {
  return (
    <button onClick={handleLoadMore} className={s.Button}>
      Load more
    </button>
  );
};

Button.propTypes = {
  handleLoadMore: PropTypes.func.isRequired,
};

export default Button;
