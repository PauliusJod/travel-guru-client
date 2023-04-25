import React, { useState } from "react";
import "./ModalWindow.css";

const Modal = ({ title, showModal, setShowModal, onModalSubmit }) => {
  const [inputText, setInputText] = useState("");

  const closeModal = () => {
    setShowModal(false);
  };

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleModalSubmit = () => {
    onModalSubmit(inputText);
    closeModal();
  };

  return (
    <div className={`modal-overlay ${showModal ? "active" : ""}`}>
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="close-modal" onClick={closeModal}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <input
            type="text"
            className="modal-input"
            value={inputText}
            onChange={handleInputChange}
          />
          <button className="modal-submit" onClick={handleModalSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
