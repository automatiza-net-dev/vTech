import ReactModal from "react-modal";

import CloseIcon from "@mui/icons-material/Close";

import { customStyles } from "./custom-styles";

import { IModalProps } from "./interfaces";

import * as S from "./styles";

export function Modal({
  style,
  title,
  warning,
  Wrapper,
  setModal,
  maxwidth,
  children,
  stateModal,
  onCloseModal,
  forceOpen,
  disableOverflow,
}: IModalProps) {
  function handleCloseModal() {
    if (forceOpen) {
      return;
    }

    onCloseModal && onCloseModal();
    setModal && setModal(false);
  }

  const ContentModal = () => {
    return (
      <S.ReactModal
      $disableOverflow={disableOverflow}
        style={{ backgroundColor: "#fff" }}
        className={title ? "hasTitle" : ""}
      >
        <div className="head">
          {title && (
            <div className="title">
              <h3>{title}</h3>

              {warning && (
                <div className="warning">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 16.99V17M12 7V14M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {warning}
                </div>
              )}
            </div>
          )}

          {!forceOpen && (
            <button
              type="button"
              className="closeModal"
              onClick={handleCloseModal}
            >
              <CloseIcon color="action" fontSize="small" />
            </button>
          )}
        </div>

        <div className="box-content">
          <div className="box-white">{children}</div>
        </div>
      </S.ReactModal>
    );
  };

  return (
    <ReactModal
      isOpen={stateModal}
      onRequestClose={handleCloseModal}
      style={customStyles({ maxWidth: maxwidth })}
      ariaHideApp={false}
    >
      {Wrapper ? (
        <Wrapper>
          <ContentModal />
        </Wrapper>
      ) : (
        <S.ReactModal style={style}>
          <ContentModal />
        </S.ReactModal>
      )}
    </ReactModal>
  );
}
