import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";

function App() {
  const { register, handleSubmit, reset, setFocus } = useForm();
  const [open, setOpen] = useState(false);
  const [carros, setCarros] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [estatisticasAbertas, setEstatisticasAbertas] = useState(false);
  const [estatisticas, setEstatisticas] = useState({
    numeroDeVeiculos: 0,
    precoMedio: 0,
    veiculoMaisCaro: { modelo: "", preco: 0 },
  });

  useEffect(() => {
    const savedCarros = JSON.parse(localStorage.getItem("carros")) || [];
    const filteredCarros = savedCarros.filter((carro) =>
      carro.modelo.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setCarros(filteredCarros);
  }, [searchQuery]);

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  const mostrarEstatisticas = () => {
    const numeroDeVeiculos = carros.length;
    const precoTotal = carros.reduce(
      (total, carro) => total + parseFloat(carro.preco),
      0
    );
    const precoMedio =
      numeroDeVeiculos > 0 ? (precoTotal / numeroDeVeiculos).toFixed(2) : 0;

    const veiculoMaisCaro = carros.reduce(
      (max, carro) =>
        parseFloat(carro.preco) > parseFloat(max.preco) ? carro : max,
      carros[0]
    );

    setEstatisticas({
      numeroDeVeiculos: numeroDeVeiculos,
      precoMedio: precoMedio,
      veiculoMaisCaro: veiculoMaisCaro,
    });

    setEstatisticasAbertas(true);
  };

  const fecharEstatisticas = () => {
    setEstatisticasAbertas(false);
  };

  const gravaDados = (data) => {
    const carros2 = [...carros];
    carros2.push({
      modelo: data.modelo,
      marca: data.marca,
      ano: data.ano,
      preco: data.preco,
      foto: data.foto,
    });
    setCarros(carros2);
    setFocus("modelo");
    reset({ modelo: "", marca: "", ano: "", preco: "", foto: "" });
    localStorage.setItem("carros", JSON.stringify(carros2));
  };

  const excluirVeiculo = (index) => {
    const novosCarros = [...carros];
    novosCarros.splice(index, 1);
    setCarros(novosCarros);
    localStorage.setItem("carros", JSON.stringify(novosCarros));
  };

  const listaCarros = carros.map((carro, index) => (
    <tr key={index}>
      <td>{carro.modelo}</td>
      <td>{carro.marca}</td>
      <td>{carro.ano}</td>
      <td>{carro.preco}</td>
      <td>
        <img
          src={carro.foto}
          alt={`Foto do Carro ${carro.modelo}`}
          width={150}
          height={100}
        />
      </td>
      <td>
        <button className="btn btn-danger" onClick={() => excluirVeiculo(index)}>
          Excluir
        </button>
      </td>
    </tr>
  ));

  return (
    <div className="container-fluid">
      <nav className="navbar bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand text-white" href="#">
            <img
              src="./logo.jpg"
              alt="Logo"
              width="60"
              height="40"
              className="d-inline-block align-text-top me-2"
            />
            Revendas Herbie - Uma Singela Homenagem
          </a>
        </div>
      </nav>

      <div className="container mt-2">
        <h2 className="d-flex justify-content-between">
          <span>Veiculos Disponíveis</span>
          <form className="d-flex" role="search">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Modelo"
              aria-label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="btn btn-outline-success w-50 " type="submit">
              Ver Todos
            </button>
          </form>
          <button className="btn btn-success px-3" onClick={onOpenModal}>
            Cadastrar
          </button>
          <button
            className="btn btn-primary mx-2"
            onClick={mostrarEstatisticas}
          >
            Estatísticas
          </button>
        </h2>

        <table className="table table-hover">
          <thead>
            <tr>
              <th>Modelo do Veiculo</th>
              <th>Marca</th>
              <th>Ano</th>
              <th>Preço</th>
              <th>Foto</th>
            </tr>
          </thead>
          <tbody>{listaCarros}</tbody>
        </table>
      </div>

      <Modal open={open} onClose={onCloseModal} center>
        <div className="card">
          <div className="card-header">Cadastro de Veículos na loja</div>
          <form className="card-body" onSubmit={handleSubmit(gravaDados)}>
            <h5 className="card-title">Informe os Dados do Veículo</h5>
            <div className="mb-3">
              <label htmlFor="modelo" className="form-label">
                Modelo:
              </label>
              <input
                type="text"
                className="form-control"
                id="modelo"
                required
                {...register("modelo")}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="marca" className="form-label">
                Marca
              </label>
              <textarea
                className="form-control"
                id="marca"
                rows="3"
                required
                {...register("marca")}
              ></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="ano" className="form-label">
                Ano
              </label>
              <textarea
                className="form-control"
                id="ano"
                rows="3"
                required
                {...register("ano")}
              ></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="preco" className="form-label">
                Preço
              </label>
              <textarea
                className="form-control"
                id="preco"
                rows="3"
                required
                {...register("preco")}
              ></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="foto" className="form-label">
                URL da Foto:
              </label>
              <input
                type="url"
                className="form-control"
                id="foto"
                required
                {...register("foto")}
              />
            </div>
            <input
              type="submit"
              value="Cadastrar"
              className="btn btn-success px-5"
            />
          </form>
        </div>
      </Modal>

      <Modal open={estatisticasAbertas} onClose={fecharEstatisticas} center>
        <div className="card">
          <div className="card-header">Estatísticas</div>
          <div className="card-body">
            <p>Número de Veículos: {estatisticas.numeroDeVeiculos}</p>
            <p>Preço Médio dos Veículos: R$ {estatisticas.precoMedio}</p>
            <p>
              Veículo Mais Caro: {estatisticas.veiculoMaisCaro.modelo} R${" "}
              {estatisticas.veiculoMaisCaro.preco}
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default App;