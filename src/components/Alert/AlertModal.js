import React, { useState, useEffect } from "react";
import { Col, Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

const AlertModal = ({ type, message, onClose }) => {
  const [title, setTitle] = useState('');
  const [color, setColor] = useState('');
  const [subtitle, setSubtitle] = useState('');

  useEffect(() => {
    if (type === 'success') {
      setTitle("Has hecho un nuevo registro");
      setColor("primary");
      setSubtitle('Éxito');
    } else {
      setTitle("¡Ups! Al parecer ocurrió un problema");
      setColor("warning");
      setSubtitle('Error');
    }
  }, [type]);

  return (
    <Col md="4">
      <Modal
        size="sm"
        className={`modal-dialog-centered modal-${color}`}
        isOpen={true}
        toggle={onClose}
      >
        <ModalHeader toggle={onClose}>{subtitle}</ModalHeader>
        <ModalBody>
          <div className="py-3 text-center">
            <i className="ni ni-bell-55 ni-3x fs-3" />
            <h4 className="heading mt-4">{title}</h4>
            <p>{message}</p>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="default" type="button" onClick={onClose}>
            Ok, Entiendo!
          </Button>
          <Button className="text-white ml-auto" color="link" type="button" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </Col>
  );
};

export default AlertModal;
