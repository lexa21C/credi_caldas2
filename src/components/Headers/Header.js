import React, { useEffect, useState } from "react";
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";
import axios from "axios";

const Header = () => {
  const [data, setData] = useState({
    capital_inicial: 0,
    capital_prestado: 0,
    capital_cancelado: 0,
    capital_disponible: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("api/cobro/");
        setData({
          capital_inicial: response.data[0].capital_inicial,
          capital_prestado: response.data[0].capital_prestado,
          capital_cancelado: response.data[0].capital_cancelado,
          capital_disponible: response.data[0].capital_disponible,
        });

      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, []); // El array vacío asegura que solo se ejecute una vez al montar el componente

  return (
    <>
      <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
        <Container fluid>
          <div className="header-body">
            {/* Card stats */}
            <Row>
             
            </Row>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Header;
