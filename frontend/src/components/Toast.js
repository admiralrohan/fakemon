import ToastContainer from "react-bootstrap/ToastContainer";
import Toast from "react-bootstrap/Toast";
import { useEffect, useState } from "react";
import { useToast } from "../context/toast-context";

export function Toastr() {
  const [show, setShow] = useState(false);
  const { toastCount, toastMessage } = useToast();
  const delay = 3000;

  useEffect(() => {
    if (toastCount > 0) setShow(true);
  }, [toastCount]);

  return (
    <ToastContainer
      hidden={!show}
      className="p-3"
      position="top-end"
      onClick={() => setShow(false)}
    >
      <Toast onClose={() => setShow(false)} delay={delay} autohide>
        <Toast.Header>
          <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
          <strong className="me-auto">Fakemon</strong>
        </Toast.Header>
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
}
