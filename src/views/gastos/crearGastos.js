import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importa el hook useNavigate
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
// core components
import Header from "components/Headers/Header.js";
import axios from "axios";

const CrearGastos = () => {
  const navigate = useNavigate(); // Inicializa el hook useNavigate
  const [formData, setFormData] = useState({
    nombre: "",
    valor: "",
    fecha: "",
  });

  // Maneja los cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Obtener el token desde localStorage
    const token = localStorage.getItem("token");

    // Si el token no está disponible, redirigir al usuario al inicio de sesión
    if (!token) {
      navigate("/login"); // Cambia la ruta de login según sea necesario
      return;
    }

    try {
      const dataToSend = {
        nombre: formData.nombre || null,
        valor: formData.valor || null,
        fecha: formData.fecha || null,
      };

      console.log("Datos enviados:", dataToSend); // Para depuración

      // Realizar la solicitud POST con el token en las cabeceras
      const response = await axios.post("api/gastos/", dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`, // Agregar token a las cabeceras
        },
      });

      console.log("Respuesta de la API:", response.data); // Verifica la estructura
      navigate(`/admin/lista-gastos`); // Redirige a la lista de gastos

      // Reinicia el formulario
      setFormData({
        nombre: "",
        valor: "",
        fecha: "",
      });
    } catch (error) {
      console.error("Error al crear el gasto:", error.response?.data || error);
      alert("Error al crear el gasto. Por favor, inténtelo de nuevo.");
    }
  };

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Registrar Gastos</h3>
              </CardHeader>
              <CardBody className="px-lg-5 py-lg-5">
                <Form role="form" onSubmit={handleSubmit}>
                  {/* Input para el nombre */}
                  <FormGroup className="mb-3">
                    <label className="form-control-label" htmlFor="nombre">
                      Gasto
                    </label>
                    <Input
                      id="nombre"
                      name="nombre" // Debe coincidir con la clave en formData
                      placeholder="Nombre del Gasto"
                      type="text"
                      value={formData.nombre}
                      onChange={handleChange}
                    />
                  </FormGroup>

                  {/* Input para el valor */}
                  <FormGroup className="mb-3">
                    <label className="form-control-label" htmlFor="valor">
                      Valor $
                    </label>
                    <Input
                      id="valor"
                      name="valor" // Debe coincidir con la clave en formData
                      placeholder="Valor $"
                      type="number"
                      value={formData.valor}
                      onChange={handleChange}
                    />
                  </FormGroup>

                  {/* Input para la fecha */}
                  <FormGroup className="mb-3">
                    <label className="form-control-label" htmlFor="fecha">
                      Fecha
                    </label>
                    <Input
                      id="fecha"
                      name="fecha" // Debe coincidir con la clave en formData
                      placeholder="Fecha"
                      type="date"
                      value={formData.fecha}
                      onChange={handleChange}
                    />
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

export default CrearGastos;
