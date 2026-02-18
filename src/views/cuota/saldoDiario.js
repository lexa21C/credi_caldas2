import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  Container,
  Row,
  CardBody,
} from "reactstrap";
import Header from "components/Headers/Header.js";
import axios from "axios";

const SaldoDiario = () => {
  const [capital, setCapital] = useState([]);
  const [fecha, setFecha] = useState(localStorage.getItem("fecha") || "");

  // Obtener el saldo diario por fecha
  const getCapital = async () => {
    try {
      const { data } = await axios.get("api/cobro/");
      setCapital(data);
      console.log(data); // Mostrar datos recibidos
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (fecha) {
      getCapital();
    }
  }, [fecha]);

  const handleFechaChange = (e) => {
    const selectedDate = e.target.value;
    setFecha(selectedDate);
    localStorage.setItem("fecha", selectedDate);
  };

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Capital Cancelado Diario</h3>
                <div style={{ marginTop: "10px" }}>
                  <input
                    type="date"
                    value={fecha}
                    onChange={handleFechaChange}
                    style={{ padding: "5px" }}
                  />
                </div>
              </CardHeader>
              <CardBody>
                <p><strong>Fecha seleccionada:</strong> {fecha}</p>
                {capital.length === 0 ? (
                  <p>No hay datos disponibles.</p>
                ) : (
                  capital.map((item) => (
                    <p key={item.id}>
                      <strong>Capital Cancelado:</strong> {item.capital_cancelado}
                    </p>
                  ))
                )}
              </CardBody>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default SaldoDiario;
