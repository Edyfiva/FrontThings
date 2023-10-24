import { useState, useEffect } from "react";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import { useForm } from "react-hook-form";

function App() {
  const { register, handleSubmit, reset, setFocus, watch } = useForm();
  const [openAdicionar, setOpenAdicionar] = useState(false);
  const [open2, setOpen2] = useState(false)
  const [viagem, setViagem] = useState([]);
  const [viagemFiltrados, setViagemFiltrados] = useState([]);
  const [filtroAtivo, setFiltroAtivo] = useState(false);
  const [modalDestino, setModalDestino] = useState("")
  const [modalAtracoes, setModalAtracoes] = useState("")
  const [modalFoto, setModalFoto] = useState("")

  function openAdicionarModal() {
    setOpenAdicionar(true);
  }
  function closeAdicionarModal() {
    setOpenAdicionar(false);
  }

  function gravaDados(data) {
    const viagem2 = [...viagem];
    viagem2.push({
      destino: data.destino,
      duracao: data.duracao,
      atracoes: data.atracoes,
      data: data.data,
      preco: Number(data.preco),
      foto: data.foto,
    });
    setViagem(viagem2);
    setFocus("destino");
    reset({ destino: "", duracao: "", atracoes: "",data: "", preco: "", foto: "" });
    localStorage.setItem("viagem", JSON.stringify(viagem2));
  }

  function mostraViagem(indice) {
    //    alert("Clicou... " + indice)

    // muda o valor das variáveis de estado que serão exibidas na modal2
    setModalDestino(viagem[indice].destino)
    setModalAtracoes(viagem[indice].atracoes)
    setModalFoto(viagem[indice].foto)

    // abre a modal2
    setOpen2(true)
  }

  function excluiViagem(indice) {
    const destino = viagem[indice].destino
    if (confirm(`Confirma a exclusão da ${destino}?`)) {
//      alert("Excluída...")
      const viagem2 = [...viagem]
      viagem2.splice(indice, 1)
      setViagem(viagem2)
      // atualiza a exclusão em localStorage
      localStorage.setItem("viagem", JSON.stringify(viagem2))
    }
  }

  const editarValor = (indice) => {
    const novoPreco = prompt("Qual o novo preço?");
    if (novoPreco !== null) {
      const precoNumerico = parseFloat(novoPreco);
      if (!isNaN(precoNumerico)) {
        const viagem3 = [...viagem];
        viagem3[indice].preco = precoNumerico;
        setViagem(viagem3);
      }
    }
  }

  function handleFiltroSubmit(data) {
    const { maiorValor } = data;
    const filtrado = viagem.filter((viagem) => viagem.preco <= Number(maiorValor));
    setViagemFiltrados(filtrado);
    setFiltroAtivo(true);
    setFocus("maiorValor");
  }

  function verTodos() {
    setFiltroAtivo(false);
  }

  const listaViagem = viagem.map((viagem, i) => (
    <tr key={viagem.destino}>
      <td>{viagem.destino}</td>
      <td>{viagem.duracao}</td>
      <td>{viagem.data}</td>
      <td>
        {`R$ ${parseFloat(viagem.preco).toLocaleString("pt-br", {
          minimumFractionDigits: 2,
        })}`}
      </td>
      <td>
        <img
          src={viagem.foto}
          alt={`Foto do Destino ${viagem.destino}`}
          width={150}
          height={100}
        />
      </td>
      <td>
        <i className="bi bi-search fs-4 text-info"
        style={{ cursor: 'pointer' }}
        title="Ver Detalhes"
        onClick={() => mostraViagem(i)}></i>
        
        <i className="bi bi-trash3 fs-4 text-danger ms-2"
        style={{ cursor: 'pointer' }}
        title="Excluir Pizza"
        onClick={() => excluiViagem(i)}></i>

        <i class="bi bi-pen fs-4 text-dark ms-2"
        style={{ cursor: 'pointer' }}
        title="Editar Valor"
        onClick={() => editarValor(i)}></i>
      </td>
    </tr>
  ));

  const listaViagemFiltrados = viagemFiltrados.map((viagem) => (
    <tr key={viagem.destino}>
      <td>{viagem.destino}</td>
      <td>{viagem.duracao}</td>
      <td>{viagem.ano}</td>
      <td>
        {`R$ ${parseFloat(viagem.preco).toLocaleString("pt-br", {
          minimumFractionDigits: 2,
        })}`}
      </td>
      <td>
        <img
          src={viagem.foto}
          alt={`Foto do Destino ${viagem.destino}`}
          width={150}
          height={100}
        />
      </td>
      <td>
        <i className="bi bi-search fs-4 text-info"
        style={{ cursor: 'pointer' }}
        title="Ver Detalhes"
        onClick={() => mostraViagem(i)}></i>
        
        <i className="bi bi-trash3 fs-4 text-danger ms-2"
        style={{ cursor: 'pointer' }}
        title="Excluir Pizza"
        onClick={() => excluiViagem(i)}></i>

        <i class="bi bi-pen fs-4 text-dark ms-2"
        style={{ cursor: 'pointer' }}
        title="Editar Valor"
        onClick={() => editarValor(i)}></i>
        
      </td>
    </tr>
  ));

  useEffect(() => {
    if (localStorage.getItem("viagem")) {
      const viagem2 = JSON.parse(localStorage.getItem("viagem"));
      setViagem(viagem2);
      setViagemFiltrados(viagem2);
    }
  }, []);


  return (
    <div className="container-fluid">
      <nav className="navbar bg-success">
        <div className="container-fluid text-danger">
          <a className="navbar-brand text-white"  href="#">
            <img
              src="./logo.jpg"
              alt="Logo"
              width="48"
              className="d-inline-block align-text-top me-4"
            />
            Agencia de Turismo Fiva - Realizando a viagem da sua vida!
          </a>
        </div>
      </nav>
      <div className="container mt-3">
        <h2 className="d-flex justify-content-between">
          <span>Pacotes de Viagens</span>
          <div className="d-flex gap-5">
            <form
              onSubmit={handleSubmit(handleFiltroSubmit)}
              className="d-flex"
              role="search"
            >
              <input
                className="form-control me-2"
                type="search"
                placeholder="Valor máximo"
                aria-label="Search"
                id="maiorValor"
                {...register("maiorValor")}
              />
              <button type="button" class="btn btn-outline-primary">
                Filtrar
              </button>
            </form>
            <button className="btn btn-primary px-3" onClick={verTodos}>
              Ver Todos
            </button>
            <button className="btn btn-success px-3" onClick={openAdicionarModal}>
              Adicionar
            </button>
          </div>
        </h2>

        <table className="table table-hover">
          <thead>
            <tr>
              <th>Destino</th>
              <th>Duração</th>
              <th>Data</th>
              <th>Preço</th>
              <th>Foto</th>
            </tr>
          </thead>
          <tbody>{filtroAtivo ? listaViagemFiltrados : listaViagem}</tbody>
        </table>
      </div>
      <Modal open={openAdicionar} onClose={closeAdicionarModal} center>
        <div className="card">
          <div className="card-header">Inclusão de Viagem</div>
          <form onSubmit={handleSubmit(gravaDados)} className="card-body">
            <h5 className="card-title">Informe os Detalhes da Viagem</h5>
            <div className="mb-3">
              <label htmlFor="modelo" className="form-label">
                Destino:
              </label>
              <input
                type="text"
                className="form-control"
                id="destino"
                required
                {...register("destino")}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="nome" className="form-label">
                Duração:
              </label>
              <input
                type="text"
                className="form-control"
                id="duracao"
                required
                {...register("duracao")}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="atracoes" className="form-label">
                Atrações:
                </label>
              <textarea 
                className="form-control" 
                id="atracoes"
                rows="3" required 
                {...register("atracoes")}>
              </textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="nome" className="form-label">
                Data:
              </label>
              <input
                type="text"
                className="form-control"
                id="data"
                required
                {...register("data")}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="preco" className="form-label">
                Preço:
              </label>
              <input
                type="number"
                className="form-control"
                id="preco"
                required
                {...register("preco")}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="foto" className="form-label">
                URL da foto:
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
              value="Enviar"
              className="btn btn-primary px-5"
            />
          </form>
          {watch("foto") &&
            <img src={watch("foto")} alt="Foto da Pizza"
              className='rounded mx-auto d-block'
              width={240} height={200} />
          }
        </div>
      </Modal>
      <Modal open={open2} onClose={() => setOpen2(false)} center>
        <div class="card">
          <img src={modalFoto} className="card-img-top" alt="Foto" 
             width={400} height={320} />
            <div class="card-body">
              <h5 class="card-title">Destino: {modalDestino}</h5>
              <p class="card-text">Atrações: {modalAtracoes}</p>
              <a href="#" class="btn btn-primary">Incluir no Roteiro</a>
            </div>
        </div>
      </Modal>
    </div>
  );
}

export default App;