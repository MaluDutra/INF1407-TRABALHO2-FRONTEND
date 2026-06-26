"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const constantes_js_1 = require("../constantes.js");
/**
 * Inicializa o formulário de registro quando a página é carregada.
 */
onload = () => {
    const form = document.getElementById('registerForm');
    form.addEventListener('submit', (event) => __awaiter(void 0, void 0, void 0, function* () {
        event.preventDefault();
        const messageDiv = document.getElementById('message');
        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password_confirm').value;
        if (password !== passwordConfirm) {
            messageDiv.textContent = 'As senhas não coincidem.';
            messageDiv.style.color = 'red';
            return;
        }
        try {
            const response = yield fetch(constantes_js_1.backendAddress + 'gerenciamento/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                    password_confirm: passwordConfirm
                })
            });
            if (response.ok) {
                messageDiv.style.color = 'green';
                messageDiv.textContent = 'Usuário criado com sucesso. Redirecionando para login...';
                setTimeout(() => {
                    window.location.href = (0, constantes_js_1.getBasePath)() + 'accounts/login.html';
                }, 2500);
                return;
            }
            const responseText = yield response.text();
            let errorMessage = responseText;
            try {
                const errorData = JSON.parse(responseText);
                if (typeof errorData === 'object' && errorData !== null) {
                    if ('message' in errorData) {
                        errorMessage = errorData.message;
                    }
                    else {
                        errorMessage = JSON.stringify(errorData);
                    }
                }
            }
            catch (_a) {
                // resposta não é JSON, mantém responseText
            }
            messageDiv.style.color = 'red';
            messageDiv.textContent = errorMessage;
        }
        catch (error) {
            messageDiv.style.color = 'red';
            messageDiv.textContent = `Erro de rede: ${error}`;
        }
    }));
};
