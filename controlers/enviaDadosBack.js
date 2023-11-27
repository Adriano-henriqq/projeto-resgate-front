
import { removeDadosSelecionados } from "../app/script.js";
async function enviaDadosParaBackend(dados) {
    try {
         const response = await fetch("https://projeto-resgate-api.vercel.app/enviar-email", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
              
            },
            body: JSON.stringify({
                dados
            })
        })

        const responseData = await response.json();

        if (response.ok) {
            responseData.messages.forEach(data => alert(data));
        } else {
            console.error('Erro no envio de emails:', responseData.message);
        }
    } catch (err) {
        console.log('Erro gerado:', err);
    }
}

//exclui da tabela os 
function excluirDadosEnviados(dadosEmailSelecionados) {
    // A função fetch aqui não está visível no código fornecido, mas assumindo que está funcionando corretamente
    fetch('http://localhost:3000/excluir-dados-enviados', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dadosExcluir: dadosEmailSelecionados,}),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Dados excluídos com sucesso!', data);
            // Após excluir os dados no servidor, você pode chamar a função para remover da tabela
        })
        .catch(error => {
            console.error('Erro ao excluir dados:', error);
        });
}


async function salvaDadosTabelaEnviados(dados) {
    try {
        const resposta = await fetch("http://localhost:3000/salva-dados", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                dados
            })
        })

        const data = await resposta.json();
        console.log('dados inseridos',data)
        console.log('resposta do back', data)
    } catch (err) {
        console.log('erro gerado', err)
    }
}

export{
    enviaDadosParaBackend,
    salvaDadosTabelaEnviados,
    excluirDadosEnviados
}