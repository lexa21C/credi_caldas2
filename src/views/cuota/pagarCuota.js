import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  Table,
  Container,
  Row,
  Input,
  Button,
  FormGroup,
  Form,
} from "reactstrap";
import Header from "components/Headers/Header.js";
import AlertModal from '../../components/Alert/AlertModal.js';
const PagarCuota = () => {
  const [detalleCredito, setDetalleCredito] = useState(null);
  const [totalSaldo, setTotalSaldo] = useState(0); // Total del saldo calculado
  const [Saldo, setSaldo] = useState(0); // Valor editable del saldo
  const { id } = useParams();
  const fechaLocalStorage = localStorage.getItem("fecha") || "2025-01-18";
  const navigate = useNavigate()

    const [showAlert, setShowAlert] = useState(false);
    const [alertType, setAlertType] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
  const formatNumber = (num) => {
    if (!num) return "";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
   // Eliminar el formato para usar valores numéricos en cálculos
   const parseNumber = (str) => {
    return parseInt(str.replace(/\./g, ""), 10) || 0;
  };

  // Método para manejar el cambio en el campo de saldo
  const handleSaldoChange = (e) => {
    const value = e.target.value;
    const numericValue = parseNumber(value); // Convertir a número sin formato
    setSaldo(numericValue); // Actualizar el estado con el valor numérico
  };
  const handleCloseAlert = () => setShowAlert(false);
  // Método para manejar el pago de las cuotas
  const handleSubmit = async (e) => {
    e.preventDefault();
    
  
    if (!detalleCredito || !detalleCredito.cuotas_filtradas.length) {
      console.error("No hay cuotas para procesar.");
      return;
    }


 
    try {
      let nuevoSaldo = Saldo;
      const cuotasFiltradas = [...detalleCredito.cuotas_filtradas];
      

      for (let i = 0; i < cuotasFiltradas.length; i++) {
        const cuota = cuotasFiltradas[i];
      console.log(nuevoSaldo)
        if (nuevoSaldo  >= cuota.valor) {
          // Saldar la cuota completamente
          if (i === cuotasFiltradas.length - 1) {
            cuota.valor_cancelado = nuevoSaldo;
              cuota.fecha_pagada = fechaLocalStorage;
              cuota.estado = "cancelado"; // Marcar como cancelado si no hay más cuotas pendientes
              console.log(cuota)
              await putCuota (cuota)

          }else {
            cuota.valor_cancelado = cuota.valor;
            nuevoSaldo -= cuota.valor;
            cuota.fecha_pagada = fechaLocalStorage;
            cuota.estado = "cancelado";
            console.log(cuota)
            await putCuota (cuota)

          }
          
        } else {
          // Cuota parcial o pendiente
          if(cuota.valor_cancelado > 0) {

            cuota.valor_cancelado = nuevoSaldo;
            cuota.estado = "pendiente";
            cuota.fecha_pagada = fechaLocalStorage;
            console.log(cuota,'pendiente')
            await putCuota (cuota)
            nuevoSaldo = 0; // El saldo se consume completamente
            break;
          }else{
            cuota.valor_cancelado = nuevoSaldo;
            cuota.estado = "pendiente";
            cuota.fecha_pagada = fechaLocalStorage;
            console.log(cuota,'pendiente')
            await putCuota (cuota)
            nuevoSaldo = 0; // El saldo se consume completamente
            break;
          }
        }
      
        // Condición adicional: Verificar si es la última cuota
        
      }      

      navigate(`/admin/detalle-credito/${detalleCredito.id}`);
    } catch (error) {
      console.error("Error al actualizar las cuotas:", error);
      alert("Hubo un error al procesar el pago.");
    }
  }

  const putCuota = async (cuota) => {
    try {

      const url = `/api/cuotas/${cuota.id}/`; // Usa el ID de la cuota directamente
      await axios.put(url, cuota); // Envía la cuota completa
      console.log(`Cuota actualizada: ${cuota.id}`);
    } catch (error) {
      console.error(`Error al actualizar la cuota ${cuota.id}:`, error);
      throw new Error(`No se pudo actualizar la cuota ${cuota.id}`);
    }
  };

  // Método para obtener el detalle del crédito
  const getDetalleCredito = async () => {
    try {
      const url = `/api/creditos/${id}/buscarCredito/?fecha=${fechaLocalStorage}`;
      const { data } = await axios.get(url);
      setDetalleCredito(data);
      console.log(data)

      // Calcula el total del saldo
      const total = data.cuotas_filtradas.reduce(
        (sum, cuota) => sum + cuota.valor,
        0
      );
      setTotalSaldo(total);
      setSaldo(total); // Inicializa el valor editable con el total calculado
    } catch (error) {
      console.error("Error al obtener el detalle del crédito:", error);
    }
  };

  // Ejecutar al montar el componente
  useEffect(() => {
    getDetalleCredito();
  }, [id]);

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Detalle del Crédito</h3>
              </CardHeader>
              <CardBody>
                {detalleCredito ? (
                  <div style={{ padding: "20px" }}>
                    <h4>Cliente: {detalleCredito.cliente.nombre_completo}</h4>
                    <p>
                      <strong>Dirección:</strong> {detalleCredito.cliente.direccion}
                    </p>
                    <p>
                      <strong>Barrio:</strong> {detalleCredito.cliente.barrio}
                    </p>
                    <p>
                      <strong>Teléfono:</strong> {detalleCredito.cliente.telefono}
                    </p>
                    <p>
                      <strong>Fecha del Préstamo:</strong>{" "}
                      {detalleCredito.fecha_prestamo}
                    </p>
                    <p>
                      <strong>Saldo:</strong> {detalleCredito.saldo}
                    </p>
                    <p>
                      <strong>Forma de Pago:</strong>{" "}
                      {detalleCredito.forma_pago}
                    </p>
                    <p>
                      <strong>Total Cuotas:</strong>{" "}
                      {detalleCredito.num_cuotas_pagadas} /{" "}
                      {detalleCredito.numero_cuotas}
                    </p>
                    <p>
                      <strong>Cuotas Atrasadas:</strong>{" "}
                      {detalleCredito.cuotas_atrasadas}
                    </p>
                    <h5>Cuotas Filtradas:</h5>
                    <Table
                      className="align-items-center table-flush"
                      responsive
                    >
                      <thead className="thead-light">
                        <tr>
                          <th scope="col">ID</th>
                          <th scope="col">Fecha de Pago</th>
                          <th scope="col">Valor</th>
                          <th scope="col">Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detalleCredito.cuotas_filtradas.map((cuota) => (
                          <tr key={cuota.id}>
                            <td>{cuota.num_cuotas}</td>
                            <td>{cuota.fecha_pago}</td>
                            <td>{cuota.valor}</td>
                            <td>{cuota.estado}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    <Form role="form" onSubmit={handleSubmit}>
                    <FormGroup className="mt-4">
                        <label>Total del Saldo: {formatNumber(totalSaldo)}</label>
                        <Input
                          type="text"
                          value={formatNumber(Saldo)}
                          onChange={handleSaldoChange}
                        />
                      </FormGroup>
                      <div className="text-center">
                        <Button className="my-4" color="primary" type="submit">
                          Pagar
                        </Button>
                      </div>
                    </Form>
                  </div>
                  
                ) : (
                  <p style={{ padding: "20px" }}>Cargando datos...</p>
                )}
                 {showAlert && (
        <AlertModal
          type={alertType}
          message={alertMessage}
          onClose={handleCloseAlert}
        />
      )}
              </CardBody>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default PagarCuota;
