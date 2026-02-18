import axios from "axios";
import { useNavigate } from "react-router-dom";
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

const ListaCapital = () => {
  const navigate = useNavigate();
  const [capital, setCapital] = useState([]); // Lista de capital
  const [searchTerm, setSearchTerm] = useState(""); // Término de búsqueda
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const itemsPerPage = 10; // Número de items por página

  // Cálculo de los índices para la paginación
  const firstIndex = (currentPage - 1) * itemsPerPage;
  const lastIndex = firstIndex + itemsPerPage;

  // Obtener la lista de capital
  const getCapital = async () => {
    try {
      const { data } = await axios.get("api/cobro/");
      setCapital(data);
      console.log(capital)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleActualizar = async (item) => {
    console.log("actualizar", item)
    try {
      const updatedItem = {
        ...item,
        capital_cancelado: 0, // Se establece en 0
      };
  
      await axios.put(`api/cobro/${item.id}/`, updatedItem); // Enviar datos actualizados
      getCapital(); // Recargar la lista después de la actualización
    } catch (error) {
      console.error("Error actualizando datos:", error);
    }
  };
  
  useEffect(() => {
    getCapital();
  }, []);

  // Filtrar los datos según el término de búsqueda
  const filteredCapital = capital.filter((item) =>
    Object.values(item)
      .map((value) => (value ? value.toString().toLowerCase() : "")) // Asegura que no haya valores undefined
      .join(" ")
      .includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Lista del Capital</h3>
                <input
                  type="text"
                  placeholder="Buscar"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ marginLeft: "10px", padding: "5px" }}
                />
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Capital Inicial</th>
                    <th scope="col">Capital Disponible</th>
                    <th scope="col">Capital Prestado</th>
                    <th scope="col">Capital Cancelado</th>
                    <th scope="col">Accion </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCapital
                    .slice(firstIndex, lastIndex) // Paginación
                    .map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.capital_inicial.toLocaleString("es-CO")}</td>
                        <td>{item.capital_disponible.toLocaleString("es-CO")}</td>
                        <td>{item.capital_prestado.toLocaleString("es-CO")}</td>
                        <td>{item.capital_cancelado.toLocaleString("es-CO")}</td>
                        <td>
                        <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleActualizar(item)}
                            style={{ marginRight: "5px" }}
                          >
                            <i  /> Actualizar
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
              <CardFooter className="py-4">
                <nav aria-label="...">
                  <Pagination
                    className="pagination justify-content-end mb-0"
                    listClassName="justify-content-end mb-0"
                  >
                    <PaginationItem disabled={currentPage === 1}>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(currentPage - 1);
                        }}
                      >
                        <i className="fas fa-angle-left" />
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(currentPage + 1);
                        }}
                      >
                        <i className="fas fa-angle-right" />
                      </PaginationLink>
                    </PaginationItem>
                  </Pagination>
                </nav>
              </CardFooter>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default ListaCapital;
