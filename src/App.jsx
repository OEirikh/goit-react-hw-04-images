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

      default:
        throw new Error(`Unsuported this type action ${type}`);
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const { query, images, isPending, page, isModalOpen, modalImg, modalAlt } =
    state;

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
        .then((img) => {
          if (img.length === 0) {
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
                  payload: { images: [...images, ...img], isPending: false },
                }
              : {
                  type: "fetchImages",
                  payload: { images: [...img], isPending: false },
                }
          );
        })
        .catch((error) => {
          console.log(error.massage);
        });
    }
  }, [isPending, page, query, images]);

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
      {images.length >= 12 && <Button handleLoadMore={handleLoadMore} />}
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

// class App extends Component {
//   state = {
//     query: "",
//     page: 1,
//     images: [],
//     isPending: false,
//     isModalOpen: false,
//     modalImg: "",
//     modalAlt: "",
//   };

//   handleSetQuery = ({ target: { name, value } }) => {
//     this.setState({ [name]: value.toLowerCase() });
//   };

//   handleSubmitForm = (e) => {
//     e.preventDefault();
//     if (this.state.query.trim() === "") {
//       return toast("enter your request please!", {
//         position: "top-center",
//         hideProgressBar: true,
//       });
//     }
//     this.setState({ page: 1, isPending: true });
//   };

//   handleTogleModal = (image, alt) => {
//     this.setState((prev) => ({
//       isModalOpen: !prev.isModalOpen,
//       modalImg: image,
//       modalAlt: alt,
//     }));
//   };

//   handleLoadMore = () => {
//     this.setState((prev) => ({ page: prev.page + 1, isPending: true }));
//   };

//   componentDidUpdate() {
//     const { query, page, isPending } = this.state;
//     if (isPending) {
//       fetchImages(query, page)
//         .then((img) => {
//           if (img.length === 0) {
//             return (
//               this.setState({ isPending: false }),
//               toast(
//                 `Ypss!!! No results were found for "${query}", please edit your query.`,
//                 {
//                   position: "top-center",
//                   hideProgressBar: true,
//                 }
//               )
//             );
//           }
//           this.setState((prev) => ({
//             images: page > 1 ? [...prev.images, ...img] : img,
//             isPending: false,
//           }));
//         })
//         .catch((error) => {
//           console.log(error.massage);
//         });
//     }
//   }

//   render() {
//     const { query, images, isPending, isModalOpen, modalImg, modalAlt } =
//       this.state;
//     const {
//       handleSetQuery,
//       handleSubmitForm,
//       handleTogleModal,
//       handleLoadMore,
//     } = this;

//     return (
//       <div className={s.App}>
//         <Searchbar
//           query={query}
//           handleSetQuery={handleSetQuery}
//           handleSubmitForm={handleSubmitForm}
//         />
//         {images.length >= 1 && (
//           <ImageGallery handleTogleModal={handleTogleModal} images={images} />
//         )}
//         {isPending && <MutatingDots ariaLabel="loading" />}
//         {images.length >= 12 && <Button handleLoadMore={handleLoadMore} />}
//         {isModalOpen && (
//           <Modal
//             modalImg={modalImg}
//             handleTogleModal={handleTogleModal}
//             tag={modalAlt}
//           />
//         )}
//         <ToastContainer autoClose={2500} />
//       </div>
//     );
//   }
// }

export default App;
