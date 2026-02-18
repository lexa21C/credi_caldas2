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
import Header from "components/Headers/Header.js";

const ListaGastos = () => {
  const [gastos, setGastos] = useState([]); // Lista de gastos
  const [searchTerm, setSearchTerm] = useState(""); // Término de búsqueda
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const itemsPerPage = 10; // Número de gastos por página

  const firstIndex = (currentPage - 1) * itemsPerPage;
  const lastIndex = firstIndex + itemsPerPage;

  const getGastos = async () => {
    try {
      const { data } = await axios.get("api/gastos/"); // Cambiar endpoint a gastos
      setGastos(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getGastos();
  }, []);

  const filteredGastos = gastos.filter((gasto) =>
    Object.values(gasto)
      .map((value) => (value ? value.toString().toLowerCase() : ""))
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
                <h3 className="mb-0">Lista de Gastos</h3>
                <input
                  type="text"
                  placeholder="Buscar gasto"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ marginLeft: "10px", padding: "5px" }}
                />
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Descripción</th>
                    <th scope="col">Monto</th>
                    <th scope="col">Fecha</th>
                    <th scope="col">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGastos.slice(firstIndex, lastIndex).map((gasto) => (
                    <tr key={gasto.id}>
                      <td>{gasto.nombre}</td>
                      <td>{gasto.valor}</td>
                      <td>{gasto.fecha}</td>
                      <td>
                        <button>Editar</button>
                        <button>Eliminar</button>
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

export default ListaGastos;
