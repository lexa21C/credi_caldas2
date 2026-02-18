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

const CrearClientes = () => {
  const navigate = useNavigate(); // Inicializa el hook useNavigate
  const [formData, setFormData] = useState({
    nombre_completo: "",
    cliente_id: "",
    telefono: "",
    barrio: "",
    direccion: "",
    direccion_otra: "",
    referencia: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Obtener el token desde localStorage
    const token = localStorage.getItem("token");
    console.log(token)
    // Si el token no está disponible, redirigir al usuario al inicio de sesión
    if (!token) {
      navigate("/login");  // Cambia la ruta de login según sea necesario
      return;
    }

    try {
      const dataToSend = {
        nombre_completo: formData.nombre_completo || null,
        cliente_id: formData.cliente_id || null,
        numRuta: 0, // Campo no incluido en el formulario
        direccion: formData.direccion || null,
        direccion_otra: formData.direccion_otra || null,
        barrio: formData.barrio || null,
        telefono: formData.telefono || null,
        referencia: formData.referencia || null
      };
      console.log("Datos enviados:", dataToSend); // Para depuración

      // Realizar la solicitud POST con el token en las cabeceras
      const response = await axios.post("api/clientes/", dataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`, // Agregar token a las cabeceras
        }
      });

      console.log("Respuesta de la API:", response.data); // Verifica la estructura

      const createdClientId = response.data.id; // Verifica si 'id' existe en la respuesta
      if (createdClientId) {
        console.log("Cliente creado:", response.data);
        // Redirige a la ruta de crear crédito pasando el ID del cliente
        navigate(`/admin/crear-credito/${createdClientId}`);
      } else {
        console.error("ID de cliente no recibido o inválido.");
      }

      // Reinicia el formulario
      setFormData({
        nombre_completo: "",
        cliente_id: "",
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
                <Form role="form" onSubmit={handleSubmit}>
                  <FormGroup className="mb-3">
                    <label className="form-control-label" htmlFor="nombre_completo">
                      Nombre Completo
                    </label>
                    <Input
                      id="nombre_completo"
                      name="nombre_completo"
                      placeholder="Nombre Completo"
                      type="text"
                      value={formData.nombre_completo}
                      onChange={handleChange}
                    />
                  </FormGroup>
                  <FormGroup className="mb-3">
                    <label className="form-control-label" htmlFor="cliente_id">
                      ID Cliente
                    </label>
                    <Input
                      id="cliente_id"
                      name="cliente_id"
                      placeholder="ID Cliente"
                      type="number"
                      value={formData.cliente_id}
                      onChange={handleChange}
                    />
                  </FormGroup>
                  <FormGroup className="mb-3">
                    <label className="form-control-label" htmlFor="telefono">
                      Teléfono
                    </label>
                    <Input
                      id="telefono"
                      name="telefono"
                      placeholder="Teléfono"
                      type="text"
                      value={formData.telefono}
                      onChange={handleChange}
                    />
                  </FormGroup>
                  <FormGroup className="mb-3">
                    <label className="form-control-label" htmlFor="barrio">
                      Barrio
                    </label>
                    <Input
                      id="barrio"
                      name="barrio"
                      placeholder="Barrio"
                      type="text"
                      value={formData.barrio}
                      onChange={handleChange}
                    />
                  </FormGroup>
                  <FormGroup className="mb-3">
                    <label className="form-control-label" htmlFor="direccion">
                      Dirección
                    </label>
                    <Input
                      id="direccion"
                      name="direccion"
                      placeholder="Dirección"
                      type="text"
                      value={formData.direccion}
                      onChange={handleChange}
                    />
                  </FormGroup>
                  <FormGroup className="mb-3">
                    <label className="form-control-label" htmlFor="direccion_otra">
                      Otra Dirección
                    </label>
                    <Input
                      id="direccion_otra"
                      name="direccion_otra"
                      placeholder="Otra Dirección"
                      type="text"
                      value={formData.direccion_otra}
                      onChange={handleChange}
                    />
                  </FormGroup>
                  <FormGroup className="mb-3">
                    <label className="form-control-label" htmlFor="referencia">
                      Referencia
                    </label>
                    <Input
                      id="referencia"
                      name="referencia"
                      placeholder="Referencia"
                      type="text"
                      value={formData.referencia}
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

export default CrearClientes;
