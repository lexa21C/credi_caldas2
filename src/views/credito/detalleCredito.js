import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Table,
} from "reactstrap";
import { useParams } from "react-router-dom";
import Header from "components/Headers/Header.js";
import axios from "axios";

const DetalleCredito = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [credito, setCredito] = useState(null);
  const fechaActual = localStorage.getItem("fecha") || "Fecha no disponible";

  const handlePagar = (creditoId, fecha) => {
    navigate(`/admin/abonar-cliente/${creditoId}/${fecha}`);
  };
  
  const handleEditar = (creditoId) => {
    navigate(`/admin/editar-credito/${creditoId}`);
  };

  const fetchCredito = async () => {
    try {
      const response = await axios.get(`/api/creditos/${id}/`);
      setCredito(response.data);
    } catch (error) {
      console.error("Error al obtener los datos del crédito:", error);
      alert("Error al cargar los datos del crédito.");
    }
  };

  useEffect(() => {
    if (id) {
      fetchCredito();
    }
  }, [id]);

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader>
                <h3 className="mb-0">Detalle del Crédito</h3>
                <button
                  className="btn btn-info btn-sm"
                  onClick={() => handleEditar(credito.id)}
                >
                   <i className="ni ni-ruler-pencil" /> Editar
                </button>
              </CardHeader>
              <CardBody className="px-lg-5 py-lg-5">
                {credito ? (
                  <div>
                    <p><strong>Cliente:</strong> {credito.cliente.nombre_completo}</p>
                    <ul>
                      {credito.cuotas &&
                        credito.cuotas
                          .filter((cuota) => cuota.valor_cancelado > 0)
                          .map((cuota, index) => (
                            <li key={index}>
                              Cuota {cuota.num_cuotas}: {cuota.valor_cancelado}
                            </li>
                          ))}
                    </ul>
                    <p><strong>Dirección:</strong> {credito.cliente.barrio} {credito.cliente.direccion}</p>
                    <p><strong>Otra Dirección:</strong>  {credito.cliente.direccion_otra}</p>
                    <p><strong>Referencia:</strong>  {credito.cliente.referencia}</p>
                    <p><strong>Teléfono:</strong> {credito.cliente.telefono}</p>
                    <p><strong>Préstamo:</strong> {credito.prestamo}</p>
                    <p><strong>Saldo:</strong> <span style={{ color: "red" }}>{credito.saldo}</span></p>
                    <p><strong>Forma de Pago:</strong> {credito.forma_pago}</p>
                    <p><strong>Total Cuotas:</strong> {credito.num_cuotas_pagadas} / {credito.numero_cuotas}</p>
                    <p><strong>Fecha del Préstamo:</strong> {credito.fecha_prestamo}</p>
                    <p><strong>Fecha:</strong> {fechaActual}</p>
                    <h4>Cuotas</h4>
                    <Table className="align-items-center table-flush" responsive>
                      <thead className="thead-light">
                        <tr>
                          <th scope="col">Id</th>
                          <th scope="col">Fecha de Pago</th>
                          <th scope="col">Valor</th>
                          <th scope="col">Valor Cancelado</th>
                          <th scope="col">Fecha Cancelada</th>
                          <th scope="col">Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {credito.cuotas && Array.isArray(credito.cuotas) && credito.cuotas.length > 0 ? (
                          credito.cuotas
                            .sort((a, b) => a.num_cuotas - b.num_cuotas)
                            .map((cuota, index) => (
                              <tr key={index}>
                                <td>{cuota.num_cuotas}</td>
                                <td>{cuota.fecha_pago || "N/A"}</td>
                                <td>{cuota.valor || "N/A"}</td>
                                <td>{cuota.valor_cancelado || "N/A"}</td>
                                <td>{cuota.fecha_pagada || "No pagada"}</td>
                                <td>
                                  {cuota?.estado !== "cancelado" && (
                                    <button
                                      className="btn btn-success btn-sm"
                                      onClick={() => handlePagar(credito.id, cuota.fecha_pago)}
                                      style={{ marginRight: "5px" }}
                                    >
                                      <i className="ni ni-fat-add" /> Pagar
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))
                        ) : (
                          <tr>
                            <td colSpan="5">No hay cuotas disponibles.</td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>
                ) : (
                  <p>Cargando datos...</p>
                )}
              </CardBody>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default DetalleCredito;
