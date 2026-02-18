import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Importa useParams para obtener el ID de la URL
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

const EditarCliente = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Obtiene el ID del cliente desde la URL
  const [formData, setFormData] = useState({
    nombre_completo: "",
    cliente_id: "",
    num_ruta: "",
    telefono: "",
    barrio: "",
    direccion: "",
    direccion_otra: "",
    referencia: "",
  });

  useEffect(() => {
    // Cargar datos del cliente cuando se monta el componente
    const fetchClienteData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(`api/clientes/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setFormData({
          nombre_completo: response.data.nombre_completo || "",
          cliente_id: response.data.cliente_id || "",
          num_ruta: response.data.num_ruta || "",
          telefono: response.data.telefono || "",
          barrio: response.data.barrio || "",
          direccion: response.data.direccion || "",
          direccion_otra: response.data.direccion_otra || "",
          referencia: response.data.referencia || "",
        });
      } catch (error) {
        console.error("Error al cargar los datos del cliente:", error);
        alert("No se pudieron cargar los datos del cliente.");
      }
    };

    fetchClienteData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const dataToSend = {
        nombre_completo: formData.nombre_completo || null,
        cliente_id: formData.cliente_id || null,
        num_ruta: formData.num_ruta || null,
        direccion: formData.direccion || null,
        direccion_otra: formData.direccion_otra || null,
        barrio: formData.barrio || null,
        telefono: formData.telefono || null,
        referencia: formData.referencia || null,
      };

      const response = await axios.put(`api/clientes/${id}/`, dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Cliente actualizado:", response.data);
      alert("Cliente actualizado correctamente.");
      navigate("/admin/lista-clientes"); // Redirige a la lista de clientes
    } catch (error) {
      console.error("Error al actualizar el cliente:", error.response?.data || error);
      alert("Error al actualizar el cliente. Por favor, inténtelo de nuevo.");
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
                <h3 className="mb-0">Editar Cliente</h3>
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
                      readOnly // Solo lectura porque es un campo fijo
                    />
                  </FormGroup>
                  <FormGroup className="mb-3">
                    <label className="form-control-label" htmlFor="num_ruta">
                      Número Ruta
                    </label>
                    <Input
                      id="num_ruta"
                      name="num_ruta"
                      placeholder="Número Ruta"
                      type="number"
                      value={formData.num_ruta}
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
                      Guardar Cambios
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

export default EditarCliente;
