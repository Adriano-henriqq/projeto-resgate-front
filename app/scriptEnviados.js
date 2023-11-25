import {enviaDadosParaBackend} from "../controlers/enviaDadosBack.js"
import {removeDadosSelecionados} from "../app/script.js"

document.addEventListener("DOMContentLoaded", async () => {
    mostrarAlerta();
    try {
        const dadosEnviados = await obterDadosEnviados();
        limparLinhasAntigas();
        adicionarLinhasNovas(dadosEnviados);
        recebeDadosDoInput();
    } catch (error) {
        console.log(error);
    }
});

function mostrarAlerta() {
    alert("Aqui estão os emails enviados, ao enviar um email ele irá desaparecer apenas para o usuário não se perder no envio, caso recarregue a página os dados voltarão a aparecer na tela");
}

async function obterDadosEnviados() {
    const resposta = await fetch('http://localhost:3000/api/dados-enviados');
    return resposta.json();
}

function limparLinhasAntigas() {
    const tabela = document.getElementById('dados-tabela');
    const linhasDados = tabela.querySelectorAll('tr:not(:first-child)');
    linhasDados.forEach(linha => linha.remove());
}

function adicionarLinhasNovas(grupoDe400) {
    const tabela = document.getElementById('dados-tabela');
    const emailsEnviados = document.querySelector("[data-enviados]");
    let contador = 0;

    grupoDe400.forEach(grupo => {
        for (const dado in grupo) {
            let numeroDeEmailsEnviados = contador + 1;
            emailsEnviados.innerHTML = `Emails enviados até o momento: ${numeroDeEmailsEnviados}`;

            let novaLinha = document.createElement('tr');
            novaLinha.innerHTML = `
                <td><input id="dados__check" type="checkbox" name="dados__check" value="1" data-nome="${grupo[dado].nome}"
                 data-email="${grupo[dado].email}"></td>
                <td>${grupo[dado].nome}</td>
                <td>${grupo[dado].email}</td>
                <td>${grupo[dado].ra}</td>
            `;
            tabela.appendChild(novaLinha);
            contador++;
        }
    });
}


function recebeDadosDoInput() {
    const checkboxes = document.querySelectorAll("#dados__check");
    let dadosEmailSelecionados = [];

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener("change", function () {

            if (this.checked) {
                const nome = checkbox.dataset.nome;
                const email = checkbox.dataset.email;
                dadosEmailSelecionados.push({
                    nome,
                    email
                });

            } else {
                const indice = dadosEmailSelecionados.findIndex(item => item.email === checkbox.dataset.email);
                if (indice !== -1) {
                    dadosEmailSelecionados.splice(indice, 1);

                }
            }


            console.log(dadosEmailSelecionados)
        })
    });



    enviaDadosEmail(dadosEmailSelecionados)
}




function enviaDadosEmail(dadosEmailSelecionados) {
    const botaoEnviar = document.querySelector("#btnSubmit")
    // aguarda o botao ser selecionado para enviar os dados
    botaoEnviar.addEventListener("click", function (event) {
        event.preventDefault()

        if (dadosEmailSelecionados.length <= 0) {
            alert('selecione ao menos uma caixa')
        } else {
            enviaDadosParaBackend(dadosEmailSelecionados)
            removeDadosSelecionados()
            window.location.reload()
            
            

        }


    })
}