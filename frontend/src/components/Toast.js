import ToastContainer from "react-bootstrap/ToastContainer";

import Toast from "react-bootstrap/Toast";

export function Toastr({ show = false }) {
  return (
    <ToastContainer hidden={!show} className="p-3" position="top-end">
      <Toast>
        <Toast.Header>
          <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
          <strong className="me-auto">Fakemon</strong>
          <small>11 mins ago</small>
        </Toast.Header>
        <Toast.Body>Hello, world! This is a toast message.</Toast.Body>
      </Toast>
    </ToastContainer>
  );
}
