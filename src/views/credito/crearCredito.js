import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
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
import { useParams } from "react-router-dom"; // Importar useParams
import Header from "components/Headers/Header.js";
import axios from "axios";

const CrearCredito = () => {
  const navigate = useNavigate()
  const { id } = useParams(); // Obtener el ID de la ruta
  const [cliente, setCliente] = useState(null); // Estado para almacenar los datos del cliente
  const [formData, setFormData] = useState({
    saldo: "",
    numero_cuotas: "",
    fecha_prestamo: "",
    forma_pago: "diario", // Valor por defecto
  });

  const FORMA_PAGO_CHOICES = [
    { value: "diario", label: "Diario" },
    { value: "semanal", label: "Semanal" },
    { value: "quincenal", label: "Quincenal" },
    { value: "mensual", label: "Mensual" },
  ];
  
  // Obtener los datos del cliente al cargar el componente
  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const response = await axios.get(`/api/clientes/${id}/`); // Llamar a la API
        setCliente(response.data); // Guardar los datos del cliente
      } catch (error) {
        console.error("Error al obtener los datos del cliente:", error);
        alert("Error al cargar los datos del cliente.");
      }
    };

    if (id) {
      fetchCliente();
    }
  }, [id]);

    // Función para formatear números con puntos como separador de miles
    const formatNumber = (num) => {
      if (!num) return "";
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };
  
    // Función para convertir valores formateados a números sin formato
    const parseNumber = (str) => {
      return parseInt(str.replace(/\./g, ""), 10) || 0;
    };
  
    // Manejar cambios en los campos del formulario
    const handleChange = (e) => {
      const { name, value } = e.target;
  
      if (name === "saldo") {
        const numericValue = parseNumber(value); // Convertir a número sin formato
        setFormData({ ...formData, [name]: numericValue }); // Actualizar estado interno
        e.target.value = formatNumber(numericValue); // Formatear visualmente el valor
      } else {
        setFormData({ ...formData, [name]: value });
      }
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        saldo: 0,
        prestamo: formData.saldo || null,
        numero_cuotas: formData.numero_cuotas || null,
        fecha_prestamo: formData.fecha_prestamo || null,
        forma_pago: formData.forma_pago, // Incluir forma de pago
        cliente: cliente.url, // Asociar el crédito al cliente
        num_cuotas_pagadas: 0
      };
      console.log("Datos enviados:", dataToSend); // Para depuración
      const response = await axios.post("/api/creditos/", dataToSend); // Ajusta la ruta según tu API
      console.log("Crédito creado:", response.data);
      const creditoId = response.data.id; 
      navigate(`/admin/detalle-credito/${creditoId}`)
      setFormData({
        saldo: "",
        numero_cuotas: "",
        fecha_prestamo: "",
        forma_pago: "diario", // Restablecer valor por defecto
      });
    } catch (error) {
      console.error("Error al registrar el crédito:", error.response?.data || error);
      alert("Error al registrar el crédito. Por favor, inténtelo de nuevo.");
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
                <h3 className="mb-0">Registrar crédito</h3>
                {cliente && (
                  <p className="mt-2">
                    Cliente: <strong>{cliente.nombre_completo}</strong>
                  </p>
                )}
              </CardHeader>
              <CardBody className="px-lg-5 py-lg-5">
                <Form role="form" onSubmit={handleSubmit}>
                <FormGroup className="mb-3">
                    <label className="form-control-label" htmlFor="saldo">
                      Préstamo
                    </label>
                    <Input
                      id="prestamo"
                      name="saldo"
                      placeholder="Saldo"
                      type="text" // Cambiar a texto para permitir formato con puntos
                      value={formatNumber(formData.saldo)} // Formatear visualmente
                      onChange={handleChange}
                    />
                  </FormGroup>
                  <FormGroup className="mb-3">
                    <label className="form-control-label" htmlFor="numero_cuotas">
                      Número de Cuotas
                    </label>
                    <Input
                      id="numero_cuotas"
                      name="numero_cuotas"
                      placeholder="Número de Cuotas"
                      type="number"
                      value={formData.numero_cuotas}
                      onChange={handleChange}
                    />
                  </FormGroup>
                  <FormGroup className="mb-3">
                    <label className="form-control-label" htmlFor="fecha_prestamo">
                      Fecha Préstamo
                    </label>
                    <Input
                      id="fecha_prestamo"
                      name="fecha_prestamo"
                      placeholder="Fecha Préstamo"
                      type="date"
                      value={formData.fecha_prestamo}
                      onChange={handleChange}
                    />
                  </FormGroup>
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
                      Guardar
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default CrearCredito;
