import { backendAddress } from './constantes.js';
onload = () => {
    document.getElementById('insere').addEventListener('click', async (e) => {
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
            const response = await fetch(backendAddress + 'SongList/criar/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                document.getElementById('mensagem').textContent = 'Inserido com sucesso!';
            }
            else {
                document.getElementById('mensagem').textContent = 'Erro ao inserir música.';
            }
        }
        catch (error) {
            console.error('Erro ao enviar dados para o backend:', error);
        }
    });
};
//# sourceMappingURL=insereMusica.js.map