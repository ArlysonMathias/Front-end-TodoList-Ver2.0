//Classes
class Requisicoes {
  async buscarTodasTarefas() {
    const response = await fetch(`${baseUrl}/listar-todas`);
    const tarefas = await response.json();

    listaDeTarefas = tarefas;

    return tarefas;
  }
  async buscarTarefaPorId(id) {
    const response = await fetch(`${baseUrl}/tarefa/${id}`);
    const tarefa = await response.json();
    console.log(response);

    return tarefa;
  }

  async criarTarefa(atividade) {
    const tarefa = { atividade };

    const response = fetch(`${baseUrl}/criar-tarefa`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify(tarefa),
    });

    const novaTarefa = await response.json();

    return novaTarefa;
  }

  async atualizarTarefa(id, atividade) {
    const tarefa = { atividade };

    const response = await fetch(`${baseUrl}/atualizar-tarefa/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify(tarefa),
    });

    const tarefaAtualizada = response.json();

    return tarefaAtualizada;
  }

  async excluirTarefa(id) {
    const response = await fetch(`${baseUrl}/deletar-tarefa/${id}`, {
      method: "DELETE",
      mode: "cors",
    });

    if (response.status == 200) {
      return true;
    } else {
      return false;
    }
  }
}

//variável auxliar
const baseUrl = "http://localhost:3000/tarefas";
let listaDeTarefas = [];
const requisicoes = new Requisicoes();

// Funções de manipulação do HTML

const imprimirTodasTarefas = async () => {
  const tarefas = await requisicoes.buscarTodasTarefas();

  document.getElementById("lista-tarefas").innerHTML = "";

  tarefas.forEach((element) => {
    document.getElementById("lista-tarefas").insertAdjacentHTML(
      "beforeend",
      `
    <div class="lista-tarefas">  
      <ul id="lista-tarefas-ul">
            <li>               
                <span class="textoTarefa">${element.atividade}</span>
                <div>
                <button onclick="abrirModalEdit('${element._id}')" class="btnEditar">
                     <i class="fa-solid fa-pencil"></i>
                </button>
                <button onclick="abrirModalDelete('${element._id}')" class="btnApagar">
                  <i class="fa-solid fa-trash-can"></i>
                </button>
                </div>
            </li>
      </ul>
    </div>
    `
    );
  });
};

// mostrar na tela por ID

const imprimirTarefaPorId = async () => {
  const input = document.getElementById("pesquisar-nome");
  const atividade = input.value;

  const tarefaSelecionada = listaDeTarefas.find(
    (element) => element.atividade === atividade
  );

  const tarefa = await requisicoes.buscarTarefaPorId(tarefaSelecionada._id);

  document.getElementById("atividade-escolhida");

  document.getElementById("atividade-escolhida").innerHTML = `
      
        <ul id="lista-tarefas">
              <li>                
                  <span class="textoTarefa">${tarefa.atividade}</span>
                  <div>
                  <button onclick="abrirModalEdit('${tarefa._id}')" class="btnEditar">
                      <i class="fa-solid fa-pencil"></i>
                  </button>
                  <button onclick="abrirModalDelete('${tarefa._id}')" class="btnApagar">
                    <i class="fa-solid fa-trash-can"></i>
                  </button>
                  </div>
              </li>
        </ul>    
      `;
};

//função cadastrar tarefa

async function cadastrarNovaTarefa() {
  const atividade = document.getElementById("novaTarefa").value;

  const tarefa = await requisicoes.criarTarefa(atividade); // await dando erro na parte visual

  document.getElementById("lista-tarefas").insertAdjacentHTML(
    "beforeend",
    `
      <div class="lista-tarefas">  
        <ul id="lista-tarefas-ul">
              <li>               
                  <span class="textoTarefa">${tarefa.atividade}</span>
                  <div>
                  <button onclick="abrirModalEdit('${tarefa._id}')" class="btnEditar">
                      <i class="fa-solid fa-pencil"></i>
                  </button>
                  <button onclick="abrirModalDelete('${tarefa._id}')"  class="btnApagar">
                    <i class="fa-solid fa-trash-can"></i>
                  </button>
                  </div>
              </li>
        </ul>
      </div>`
  );
  document.getElementById("novaTarefa").value = "";

  imprimirTodasTarefas();
}

// MODAIS

//Abrir e fechar modais de pesquisa
function abrirModalPesquisa() {
  const nome = document.getElementById("pesquisar-nome").value;

  const tarefaSelecionada = listaDeTarefas.find(
    (element) => element.atividade === nome
  );

  if (tarefaSelecionada) {
    document.querySelector(".modal-overlay").style.display = "flex";
    imprimirTarefaPorId(tarefaSelecionada);
  } else {
    alert("Tarefa não encontrada.");
  }

  document.getElementById("pesquisar-nome").value = "";
}

function fecharModal() {
  document.querySelector(".modal-overlay").style.display = "none";
}

// modal deletar

function abrirModalDelete(id) {
  document.querySelector(".modal-overlay-delete").style.display = "flex";

  const btnConfirmar = document.getElementById("btn-apagar-yes");

  btnConfirmar.addEventListener("click", async () => {
    const exclusao = await requisicoes.excluirTarefa(id);

    if (exclusao) {
      fecharModalDelete();
      mostrarNotificacao("sucesso", "Tarefa excluída com sucesso")
      imprimirTodasTarefas();
    } else {
      fecharModalDelete();
      mostrarNotificacao("error", "Tarefa não encontrada")
      imprimirTodasTarefas();
    }
  });
}

function fecharModalDelete() {
  document.querySelector(".modal-overlay-delete").style.display = "none";
}

function abrirModalEdit(id) {
  document.querySelector(".modal-overlay-edit").style.display = "flex";

  const tarefa = listaDeTarefas.find((element) => element._id === id);

  document.getElementById("atualizarTarefa").value = tarefa.atividade;

  const bntAtualizar = document.getElementById("btn-atualizar-tarefa");

  bntAtualizar.addEventListener("click", async () => {
    const atividade = document.getElementById("atualizarTarefa").value;

    await requisicoes.atualizarTarefa(id, atividade);

    imprimirTodasTarefas();
    fecharModalEdit();
  });
}

function fecharModalEdit() {
  document.querySelector(".modal-overlay-edit").style.display = "none";
}

//chamando a função que imprime as tarefas na tela
imprimirTodasTarefas();

//Notificação

function mostrarNotificacao(tipo, frase){

  const notificacaoSpan = document.getElementById("notificacao-span");
  const notificacaoP = document.getElementById("notificacaoP");

  if(tipo === "sucesso"){
    notificacaoSpan.innerText = "V"
    notificacaoSpan.classList.add("notificacao-span-sucesso")
  }else if (tipo === "error"){
    notificacaoSpan.innerText = "X"
    notificacaoSpan.classList.add("notificacao-span-fracasso")
  }


  notificacaoP.innerText = frase;


  document.getElementById("notificacao").style.display = "flex"

  setTimeout(()=>{
    esconderNotificacao();
  }, 3000)
}

function esconderNotificacao(){
  document.getElementById("notificacao").style.display = "none"
}