import ToastContainer from "react-bootstrap/ToastContainer";
import Toast from "react-bootstrap/Toast";
import { useEffect, useState } from "react";

export function Toastr({ message, toastCount }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (toastCount > 0) {
      setShow(true);
      setTimeout(() => {
        setShow(false);
      }, 2000);
    }
  }, [toastCount]);

  return (
    <ToastContainer
      hidden={!show}
      className="p-3"
      position="top-end"
      onClick={() => setShow(false)}
    >
      <Toast onClose={() => setShow(false)}>
        <Toast.Header>
          <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
          <strong className="me-auto">Fakemon</strong>
        </Toast.Header>
        <Toast.Body>{message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
}
