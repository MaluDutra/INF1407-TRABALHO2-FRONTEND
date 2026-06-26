import { backendAddress } from './constantes.js';

onload = () => {
    (document.getElementById('insere') as HTMLButtonElement).addEventListener('click', async e => {
        e.preventDefault();
        const elements = (document.getElementById('meuFormulario') as HTMLFormElement).elements; 
        let data: Record<string, string> = {};
        // Coleta os dados do formulário
        for (let i = 0; i < elements.length; i++) {
            const element = elements.item(i) as HTMLInputElement;
            if (element.name) { data[element.name] = element.value; }
        }
        try {
            const response = await fetch(backendAddress + 'SongList/criar/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                (document.getElementById('mensagem') as HTMLDivElement).textContent = 'Inserido com sucesso!';
            } else {
                (document.getElementById('mensagem') as HTMLDivElement).textContent = 'Erro ao inserir música.';
            }
        } catch (error) {
            console.error('Erro ao enviar dados para o backend:', error);
        }
    });
}