import { backendAddress } from './constantes.js';
onload = async () => {
    // Parte 1: carregar dados do carro a ser editado e preencher o formulário
    // Carrega os dados do carro a ser editado do banco de dados
    // Preenche o formulário com os dados do carro
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const idPlace = document.getElementById('id');
    const idSpan = document.getElementById('id-span');
    if (id) {
        idPlace.value = id;
        if (idSpan) {
            idSpan.textContent = id;
        }
        try {
            const response = await fetch(backendAddress + 'SongList/umamusica/' + id + '/');
            if (response.ok) {
                const musica = await response.json();
                let campos = ['id', 'titulo', 'artista', 'album', 'ano'];
                campos.forEach(campo => {
                    const elemento = document.getElementById(campo);
                    if (elemento) {
                        elemento.value = musica[campo];
                    }
                });
            }
            else {
                console.error('Erro ao buscar dados da música:', response.status);
            }
        }
        catch (error) {
            console.error('Erro ao buscar dados da música:', error);
        }
    }
    else {
        idPlace.value = 'URL mal formada: ' + window.location;
    }
    // Parte 2: configurar o evento de clique do botão "Atualizar"
    document.getElementById('atualiza').addEventListener('click', async (e) => {
        e.preventDefault();
        const elements = document.getElementById('meuFormulario').elements;
        let data = {};
        // Coleta os dados do formulário
        for (let i = 0; i < elements.length; i++) {
            const element = elements.item(i);
            if (element.name) {
                data[element.name] = element.value;
            }
        }
        try {
            // const token = localStorage.getItem('access_token');
            const response = await fetch(backendAddress + 'SongList/umamusica/' + id + '/', {
                method: 'PUT',
                headers: {
                    // 'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                document.getElementById('mensagem').textContent = 'Música atualizada com sucesso!';
            }
            else {
                document.getElementById('mensagem').textContent = 'Erro ao atualizar música.';
            }
        }
        catch (error) {
            console.error('Erro ao enviar dados para o backend:', error);
        }
    });
};
//# sourceMappingURL=update.js.map