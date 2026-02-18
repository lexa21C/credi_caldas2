import { useState } from "react";
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

const CrearClientes = () => {
  const [formData, setFormData] = useState({
    credito: "",
    fecha_pago: "",
    fecha_cancelado: "",
    valor: "",
    valor_cancelado: "",
    estado: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        nombre_completo: formData.nombre_completo || null,
        clienteId: formData.clienteId || null,
        numRuta: 0, // Campo no incluido en el formulario
        direccion: formData.direccion || null,
        direccion_otra: formData.direccion_otra || null,
        barrio: formData.barrio || null,
        telefono: formData.telefono || null,
      };
      console.log("Datos enviados:", dataToSend); // Para depuración
      const response = await axios.put("api/clientes/", dataToSend);
      console.log("Cliente creado:", response.data);
      alert("Cliente creado exitosamente");
      setFormData({
        nombre_completo: "",
        clienteId: "",
        telefono: "",
        barrio: "",
        direccion: "",
        direccion_otra: "",
      });
    } catch (error) {
      console.error("Error al crear el cliente:", error.response?.data || error);
      alert("Error al crear el cliente. Por favor, inténtelo de nuevo.");
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
                <h3 className="mb-0">Crear Clientes</h3>
              </CardHeader>
              <CardBody className="px-lg-5 py-lg-5">
                
                
                  <div className="text-center">
                    <Button className="my-4" color="primary" type="submit">
                      Guardar
                    </Button>
                  </div>
            
              </CardBody>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default CrearClientes;