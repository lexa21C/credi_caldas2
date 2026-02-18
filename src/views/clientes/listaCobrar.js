import { useNavigate } from "react-router-dom"; // Importa useNavigate
import axios from "axios";
import { useState, useEffect } from "react";

import {
  Badge,
  Card,
  CardHeader,
  CardFooter,
  Pagination,
  PaginationItem,
  PaginationLink,
  Table,
  Container,
  Row,
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";

const ListaCobrar = () => {
  const [creditos, setCreditos] = useState([]); // Lista de clientes
  const [cuota, setCuota] = useState([]); // Lista de clientes
  const [searchTerm, setSearchTerm] = useState(""); // Término de búsqueda
  const [fecha, setFecha] = useState(localStorage.getItem("fecha") || ""); // Fecha desde localStorage o vacía
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const itemsPerPage = 10; // Número de clientes por página
  const [typeProfile, setTypeProfile] = useState(null);
  const navigate = useNavigate(); // Hook para navegar entre rutas
   const [noPasarCreditos, setNoPasarCreditos] = useState(() => {
    const saved = localStorage.getItem("noPasarCreditos");
    return saved ? JSON.parse(saved) : [];
  });

  // Cálculo de los índices para la paginación
  const firstIndex = (currentPage - 1) * itemsPerPage;
  const lastIndex = firstIndex + itemsPerPage;

  // Obtener la lista de clientes por fecha
  const getCreditos = async () => {
    try {
      const { data } = await axios.get(`/api/creditos/buscar_por_fecha/?fecha=${fecha}`);
      setCreditos(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const storedTypeProfile = localStorage.getItem("perfil");
    const json = JSON.parse(storedTypeProfile);
    setTypeProfile(json.rol)
    getCreditos();
  }, [fecha]);

  const filteredcreditos = creditos
    .filter((credito) =>
      Object.values(credito)
        .map((value) => (value ? value.toString().toLowerCase() : ""))
        .join(" ")
        .includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (a.cliente.num_ruta === null) return -1;
      if (b.cliente.num_ruta === null) return 1;
      return a.cliente.num_ruta - b.cliente.num_ruta;
    });



  // Guardar la fecha en localStorage
  const handleFechaChange = (e) => {
    const selectedDate = e.target.value;
    setFecha(selectedDate);
    localStorage.setItem("fecha", selectedDate); // Guardamos la fecha en localStorage
  };

  // Manejar clic en botón "Pagar"
  const handlePagar = (creditoId) => {
    navigate(`/admin/abonar-cuota/${creditoId}`);
  };

  const handlePendiente = async (cuota) => {
    try {
      // Crear una copia del objeto cuota y actualizar el estado a "pendiente"
      const updatedCuota = { ...cuota, estado: "pendiente" };
      // Hacer la solicitud PUT para actualizar la cuota
      const response = await axios.put(`/api/cuotas/${cuota.id}/editar-pendiente/`, updatedCuota);
      alert("La cuota ha sido marcada como pendiente.");
  
      // Volver a traer los datos actualizados
      await getCreditos();
    } catch (error) {
      console.error("Error al actualizar la cuota:", error);
      alert("Hubo un error al intentar actualizar la cuota.");
    }
  };
  

  // Manejar clic en botón "Crédito"
  const handleCredito = (creditoId) => {
    navigate(`/admin/detalle-credito/${creditoId}`);
  };
  const handleNoPasar = (creditoId) => {
    const updated = noPasarCreditos.includes(creditoId)
      ? noPasarCreditos.filter((id) => id !== creditoId)
      : [...noPasarCreditos, creditoId];

    setNoPasarCreditos(updated);
    localStorage.setItem("noPasarCreditos", JSON.stringify(updated));
  };
  // ✅ Sumar total de todas las cuotas
const totalCobrar = filteredcreditos.reduce((total, credito) => {
  if (Array.isArray(credito.cuotas)) {
    const sumaCuotas = credito.cuotas.reduce((suma, cuota) => {
      console.log("Valor de cuota:", cuota);
      return suma + parseFloat(cuota.valor);
    }, 0);
    return total + sumaCuotas;
  }
  return total;
}, 0);


  return (
    <>
      <Header />
       <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Lista de créditos</h3>
                <p style={{ marginTop: "10px", fontWeight: "bold", color: "#2dce89" }}>
  Total de todas las cuotas: ${totalCobrar.toLocaleString("es-CO")}
</p>

                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                  <input
                    type="text"
                    placeholder="Buscar cliente"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ padding: "5px" }}
                  />
                  <input
                    type="date"
                    value={fecha}
                    onChange={handleFechaChange}
                    style={{ padding: "5px" }}
                  />
                </div>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col"># Ruta</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">$</th>
                    <th scope="col">Celular</th>
                    <th scope="col">Barrio</th>
                    <th scope="col">Dirección</th>
                    <th scope="col">Hora</th>
                    <th scope="col">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredcreditos.slice().map((credito) => (
                    <tr
                      key={credito.cliente.id}
                      style={{
                        backgroundColor: noPasarCreditos.includes(credito.id) ? "#f8d7da" : "transparent",
                      }}
                    >
                      <td>{credito.cliente.num_ruta}</td>
                      <td>{credito.cliente.nombre_completo}</td>
                      <td>
                        <button
                          className="btn btn-success btn-sm"
                          style={{ marginRight: "5px" }}
                          onClick={() => handlePagar(credito.id)}
                        >
                          Pagar
                        </button>
                      </td>
                      <td>{credito.cliente.telefono}</td>
                      <td>{credito.cliente.barrio}</td>
                      <td>{credito.cliente.direccion || "N/A"}</td>
                      <td>{credito.cliente.referencia || "N/A"}</td>
                      <td>
                        <button
                          className="btn btn-info btn-sm"
                          style={{ marginRight: "5px" }}
                          onClick={() => handleCredito(credito.id)}
                        >
                          Crédito
                        </button>
                        {typeProfile === "administrador" && credito?.cuotas !== null && (
                          <button
                            className="btn btn-danger btn-sm"
                            style={{ marginRight: "5px" }}
                            onClick={() => handlePendiente(credito.cuotas[0])}
                          >
                            Pendiente
                          </button>
                        )}
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => handleNoPasar(credito.id)}
                        >
                          No pasar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <CardFooter className="py-4" />
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default ListaCobrar;
