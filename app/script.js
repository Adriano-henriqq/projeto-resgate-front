
import { enviaDadosParaBackend, excluirDadosEnviados, salvaDadosTabelaEnviados } from "../controlers/enviaDadosBack.js"

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const dados = await fetch('http://localhost:3000/api/dados').then(resposta => resposta.json())
            const tabela = document.getElementById('dados-tabela')
           
            for (let dado in dados) {
                criaLinhas(dados, dado, tabela)
            }
        

         return recebeDadosInput();

        

    } catch (error) {
        console.log(error);
    }
})



function criaLinhas(dados, dado, tabela) {
    let novaLinha = document.createElement('tr')
    novaLinha.classList.add('lista_transition')
    novaLinha.innerHTML = `
                <td><input id = "dados__check" type="checkbox" name="dados__check" value="${dados[dado].id}" data-nome="${dados[dado].nome}"
                 data-email="${dados[dado].email}" ></td>
                <td>${dados[dado].nome}</td>
                <td>${dados[dado].email}</td>
                <td>${dados[dado].ra}</td>
                `
    tabela.appendChild(novaLinha)
}

function recebeDadosInput() {
    const checkboxMestre = document.querySelector("#check-mestre")
    const checkbox = document.querySelectorAll("#dados__check");
    let dadosEmailSelecionados = [];
    let selecionados = 0;
    const contadorSelecionados = document.querySelector("[data-contador]")

    
    checkboxMestre.addEventListener("change", function () {
        const limiteSelecao = parseInt(prompt("Selecione a quantidade de emails a enviar! (apenas numeros)")) || 0;
        
        checkbox.forEach(cb => {
            cb.checked = this.checked;
    
            if (this.checked) {
                const nome = cb.dataset.nome;
                const email = cb.dataset.email;
                const value = cb.value;
    
                if (selecionados < limiteSelecao) {
                    dadosEmailSelecionados.push({ nome, email, value });
                    selecionados++;
                } else {
                    cb.checked = false;
                }
            } else {
                const indice = dadosEmailSelecionados.findIndex(item => item.email === cb.dataset.email);
                if (indice !== -1) {
                    dadosEmailSelecionados.splice(indice, 1);
                    selecionados--;
                }
            }
        });
    
        if (selecionados > 0) {
            contadorSelecionados.innerText = `${selecionados} emails selecionados`;
        } else {
            contadorSelecionados.innerText = ""; // 
        }
    
        console.log(dadosEmailSelecionados);
    });

    
    const botaoEnviar = document.querySelector("#btnSubmit")
    // aguarda o botao ser selecionado para enviar os dados
    botaoEnviar.addEventListener("click", async function (event) {
        event.preventDefault()
        const carregamento = checkboxMestre.parentNode
        const elemento = carregamento.parentNode
        const carregador = document.createElement("div")
        carregador.classList.add('carregador-active')
        carregador.style.display = 'block'
        elemento.appendChild(carregador);
        
        if (dadosEmailSelecionados.length <= 0) {
                alert('selecione ao menos uma caixa')
                carregador.style.display = 'none';
            } else {
                
                enviaDadosParaBackend(dadosEmailSelecionados)
                .then(()=>{
                    excluirDadosEnviados(dadosEmailSelecionados)
                    salvaDadosTabelaEnviados(dadosEmailSelecionados)
                    removeDadosSelecionados() 
                    dadosEmailSelecionados = []
                   
                carregador.style.display = 'none'
                carregador.classList.remove('carregador-active')
                    checkboxMestre.checked = false
                    checkbox.forEach(cb => cb.checked = false)
                    selecionados = 0
                    contadorSelecionados.innerText = selecionados
                    console.log(dadosEmailSelecionados)
                    window.location.reload()
                   
                })
                
                
                         
            }
            
            console.log('apos o envio', dadosEmailSelecionados)
    
        })
    
}


function removeDadosSelecionados() {
    const checkboxSelecionados = document.querySelectorAll("#dados__check:checked");

    checkboxSelecionados.forEach(checkbox => {
        const linha = checkbox.closest('tr');
        linha.remove();
    });
}



export{
    removeDadosSelecionados,
}