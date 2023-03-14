import React from "react";
import ToastContainer from "react-bootstrap/ToastContainer";
import Toast from "react-bootstrap/Toast";
import useToast from "../../hooks/useToast";

function Toastr() {
  const [show, setShow] = React.useState(false);
  const { toastCount, toastMessage } = useToast();
  const delay = 3000;

  React.useEffect(() => {
    if (toastCount > 0) setShow(true);
  }, [toastCount]);

  return (
    <ToastContainer
      hidden={!show}
      className="p-3"
      containerPosition="fixed"
      position="bottom-end"
      onClick={() => setShow(false)}
    >
      <Toast onClose={() => setShow(false)} delay={delay} autohide={show}>
        <Toast.Header>
          <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
          <strong className="me-auto">Fakemon</strong>
        </Toast.Header>
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
}

export default Toastr;
