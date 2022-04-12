import s from "./App.module.css";
import { useReducer, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { MutatingDots } from "react-loader-spinner";
import Searchbar from "./components/Searchbar";
import ImageGallery from "./components/ImageGallery";
import Button from "./components/Button";
import Modal from "./components/Modal";
import fetchImages from "./components/Services/api";

function App() {
  const initialState = {
    query: "",
    page: 1,
    images: [],
    isPending: false,
    isModalOpen: false,
    modalImg: "",
    modalAlt: "",
    total: 0,
  };

  const reducer = (
    state,
    {
      type,
      payload: {
        query,
        page,
        images,
        isPending,
        isModalOpen,
        modalImg,
        modalAlt,
        total,
      },
    }
  ) => {
    switch (type) {
      case "handleSetQuery":
        return { ...state, query: query };
      case "handleSubmitForm":
        return { ...state, page: page, isPending: isPending };
      case "handleTogleModal":
        return {
          ...state,
          isModalOpen: isModalOpen,
          modalImg: modalImg,
          modalAlt: modalAlt,
        };
      case "handleLoadMore":
        return { ...state, page: page, isPending: isPending };
      case "isPending":
        return { ...state, isPending: isPending };
      case "fetchImages":
        return {
          ...state,
          images: images,
          isPending: isPending,
        };
      case "total":
        return { ...state, total: total };

      default:
        throw new Error(`Unsuported this type action ${type}`);
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    query,
    images,
    isPending,
    page,
    isModalOpen,
    modalImg,
    modalAlt,
    total,
  } = state;

  const handleSetQuery = ({ target: { value } }) => {
    dispatch({ type: "handleSetQuery", payload: { query: value } });
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (query.trim() === "") {
      return toast("enter your request please!", {
        position: "top-center",
        hideProgressBar: true,
      });
    }
    dispatch({
      type: "handleSubmitForm",
      payload: { page: 1, isPending: true },
    });
  };

  const handleTogleModal = (image, alt) => {
    dispatch({
      type: "handleTogleModal",
      payload: {
        isModalOpen: !isModalOpen,
        modalImg: image || "",
        modalAlt: alt || "",
      },
    });
  };

  const handleLoadMore = () => {
    dispatch({
      type: "handleLoadMore",
      payload: { page: page + 1, isPending: true },
    });
  };

  useEffect(() => {
    if (isPending) {
      fetchImages(query, page)
        .then((data) => {
          dispatch({ type: "total", payload: { total: data.total } });
          if (data.hits.length === 0) {
            return (
              dispatch({ type: "isPending", payload: { isPending: false } }),
              toast(
                `Ypss!!! No results were found for "${query}", please edit your query.`,
                {
                  position: "top-center",
                  hideProgressBar: true,
                }
              )
            );
          }
          dispatch(
            page > 1
              ? {
                  type: "fetchImages",
                  payload: {
                    images: [...images, ...data.hits],
                    isPending: false,
                  },
                }
              : {
                  type: "fetchImages",
                  payload: { images: [...data.hits], isPending: false },
                }
          );
        })
        .catch((error) => {
          console.log(error.massage);
        });
    }
  }, [images, isPending, page, query]);

  return (
    <div className={s.App}>
      <Searchbar
        handleSetQuery={handleSetQuery}
        handleSubmitForm={handleSubmitForm}
        query={query}
      />
      {images.length >= 1 && (
        <ImageGallery handleTogleModal={handleTogleModal} images={images} />
      )}
      {isPending && <MutatingDots ariaLabel="loading" />}
      {images.length >= 12 && images.length !== total && (
        <Button handleLoadMore={handleLoadMore} />
      )}
      {isModalOpen && (
        <Modal
          modalImg={modalImg}
          handleTogleModal={handleTogleModal}
          tag={modalAlt}
        />
      )}
      <ToastContainer autoClose={2500} />
    </div>
  );
}

export default App;
