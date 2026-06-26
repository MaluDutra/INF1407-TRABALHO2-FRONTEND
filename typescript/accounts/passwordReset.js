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
 * Processa o envio do formulário de recuperação de senha.
 *
 * O formulário envia o e-mail do usuário para o endpoint de
 * password-reset do backend e exibe uma mensagem de status.
 */
addEventListener("DOMContentLoaded", (evento) => {
    const form = document.getElementById("formulario");
    form.addEventListener("submit", (event) => __awaiter(void 0, void 0, void 0, function* () {
        event.preventDefault();
        const messageDiv = document.getElementById("message");
        const email = document.getElementById("email").value;
        try {
            const response = yield fetch(constantes_js_1.backendAddress + "gerenciamento/password-reset/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            });
            if (response.ok) {
                // Solicitação aceita: instruções enviadas por e-mail
                messageDiv.textContent = "Instruções para resetar a senha foram enviadas para o seu e-mail.";
                messageDiv.style.color = "green";
                setTimeout(() => {
                    location.href = (0, constantes_js_1.getBasePath)() + 'accounts/passwordResetDone.html';
                }, 3000);
            }
            else {
                // Erro retornado pelo servidor
                const errorData = yield response.json();
                messageDiv.textContent = `Erro: ${errorData.message}`;
            }
        }
        catch (error) {
            // Erro de rede ou falha na requisição
            messageDiv.textContent = `Erro de rede: ${error}`;
        }
    }));
});
