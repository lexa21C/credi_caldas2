import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
} from "reactstrap";
import Header from "components/Headers/Header.js";
import axios from "axios";

const EditarCredito = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const [credito, setCredito] = useState(null);
  const [formData, setFormData] = useState({
    saldo: "",
    numero_cuotas: "",
    fecha_prestamo: "",
    forma_pago: "",
    cliente: "",
    prestamo: "",
    num_cuotas_pagadas: "",
  });

  const FORMA_PAGO_CHOICES = [
    { value: "diario", label: "Diario" },
    { value: "semanal", label: "Semanal" },
    { value: "quincenal", label: "Quincenal" },
    { value: "mensual", label: "Mensual" },
  ];

  useEffect(() => {
    const fetchCredito = async () => {
      try {
        const response = await axios.get(`/api/creditos/${id}/`);
        setCredito(response.data);
        setFormData({
          cliente: response.data.cliente.url || "",
          prestamo: response.data.prestamo || 0,
          saldo: response.data.saldo || 0,
          num_cuotas_pagadas: response.data.num_cuotas_pagadas || 0,
          numero_cuotas: response.data.numero_cuotas || "",
          fecha_prestamo: response.data.fecha_prestamo || "",
          forma_pago: response.data.forma_pago || "diario",
        });
      } catch (error) {
        console.error("Error al obtener los datos del crédito:", error);
        alert("No se pudieron cargar los datos del crédito.");
      }
    };

    if (id) {
      fetchCredito();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      cliente: formData.cliente,
      fecha_prestamo: formData.fecha_prestamo,
      num_cuotas_pagadas: formData.num_cuotas_pagadas,
      prestamo: formData.saldo,
      numero_cuotas: formData.numero_cuotas,
      forma_pago: formData.forma_pago,
      saldo: formData.saldo, 
    };

    try {
      await axios.put(`/api/creditos/${id}/`, dataToSend);
      alert("Crédito actualizado exitosamente.");
      navigate(`/admin/detalle-credito/${id}`);
    } catch (error) {
      console.error("Error al actualizar el crédito:", error);
      alert("Hubo un problema al actualizar el crédito.");
    }
  };

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader>
                <h3 className="mb-0">Editar Crédito</h3>
                {credito && (
                  <p className="mt-2">
                    Cliente: <strong>{credito.cliente.nombre_completo}</strong>
                  </p>
                )}
              </CardHeader>
              <CardBody className="px-lg-5 py-lg-5">
                {credito ? (
                  <Form role="form" onSubmit={handleSubmit}>
                    {/* Campo editable - Saldo */}
                    <FormGroup className="mb-3">
                      <label className="form-control-label" htmlFor="saldo">
                        Saldo
                      </label>
                      <Input
                        id="saldo"
                        name="saldo"
                        type="number"
                        value={formData.saldo}
                        onChange={handleChange}
                      />
                    </FormGroup>

                    {/* Campo editable - Número de Cuotas */}
                    <FormGroup className="mb-3">
                      <label className="form-control-label" htmlFor="numero_cuotas">
                        Número de Cuotas
                      </label>
                      <Input
                        id="numero_cuotas"
                        name="numero_cuotas"
                        type="number"
                        value={formData.numero_cuotas}
                        onChange={handleChange}
                      />
                    </FormGroup>

                    {/* Campo solo lectura - Fecha Préstamo */}
                    <FormGroup className="mb-3">
                      <label className="form-control-label" htmlFor="fecha_prestamo">
                        Fecha de Préstamo
                      </label>
                      <Input
                        id="fecha_prestamo"
                        name="fecha_prestamo"
                        type="date"
                        value={formData.fecha_prestamo}
                        onChange={handleChange}
                      
                      />
                    </FormGroup>

                    {/* Campo editable - Forma de Pago */}
                    <FormGroup className="mb-3">
                      <label className="form-control-label" htmlFor="forma_pago">
                        Forma de Pago
                      </label>
                      <Input
                        id="forma_pago"
                        name="forma_pago"
                        type="select"
                        value={formData.forma_pago}
                        onChange={handleChange}
                      >
                        {FORMA_PAGO_CHOICES.map((choice) => (
                          <option key={choice.value} value={choice.value}>
                            {choice.label}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>

                    <div className="text-center">
                      <Button className="my-4" color="primary" type="submit">
                        Guardar Cambios
                      </Button>
                    </div>
                  </Form>
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

export default EditarCredito;
