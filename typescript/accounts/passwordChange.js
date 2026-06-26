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
const common_js_1 = require("./common.js");
/**
 * Inicializa o formulario de alteração de senha após o carregamento do DOM.
 * Verifica se a nova senha e a confirmação coincidem antes de enviar a requisição.
 */
addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formulario");
    form.addEventListener("submit", (event) => __awaiter(void 0, void 0, void 0, function* () {
        event.preventDefault();
        const messageDiv = document.getElementById("message");
        const currentPassword = document.getElementById("old_password").value;
        const newPassword = document.getElementById("new_password").value;
        const confirmPassword = document.getElementById("confirm_password").value;
        // Validação local: garante que a senha nova e a confirmação sejam iguais
        if (newPassword !== confirmPassword) {
            messageDiv.textContent = "A nova senha e a confirmação não coincidem.";
            return;
        }
        try {
            const response = yield (0, common_js_1.authFetch)(constantes_js_1.backendAddress + "gerenciamento/change-password/", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    old_password: currentPassword,
                    new_password: newPassword
                })
            });
            if (response.ok) {
                messageDiv.textContent = "Senha alterada com sucesso! Você será redirecionado para a página de login em breve.";
                // Remove os tokens locais para efetivar o logout após mudança de senha
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                setTimeout(() => {
                    location.href = (0, constantes_js_1.getBasePath)() + "accounts/login.html";
                }, 3000);
            }
            else {
                const errorData = yield response.json();
                messageDiv.textContent = `Erro: ${errorData.message}`;
            }
        }
        catch (error) {
            // Captura falhas de rede ou exceções geradas pela requisição
            messageDiv.textContent = `Erro de rede: ${error}`;
        }
    }));
});
