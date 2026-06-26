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
 * Inicializa a página de redefinição de senha quando o carregamento é concluído.
 * Registra os eventos dos botões e configura a troca de visibilidade dos campos.
 */
addEventListener("load", function () {
    document.getElementById('eyeIconNovaSenha').addEventListener('click', trocaOlho);
    document.getElementById('eyeIconConfirmarSenha').addEventListener('click', trocaOlho);
    document.getElementById("enviaNovaSenha").addEventListener("click", function (evento) {
        return __awaiter(this, void 0, void 0, function* () {
            evento.preventDefault();
            const token = document.getElementById("token").value;
            const senha = document.getElementById("novaSenha").value;
            const senha2 = document.getElementById("confirmarSenha").value;
            const message = document.getElementById("message");
            // Valida se as duas senhas digitadas são iguais
            if (senha !== senha2) {
                message.textContent = "As senhas não coincidem.";
                message.style.color = "red";
                return;
            }
            const response = yield fetch(constantes_js_1.backendAddress + 'gerenciamento/password-reset/', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    code: token,
                    new_password: senha
                })
            });
            if (response.ok) {
                message.textContent = "Senha alterada com sucesso! Redirecionando para a página de login...";
                message.style.color = "green";
                setTimeout(() => {
                    location.href = (0, constantes_js_1.getBasePath)() + "accounts/login.html";
                }, 3000);
            }
            else {
                const data = yield response.json();
                message.textContent = data.detail || "Ocorreu um erro ao alterar a senha.";
                message.style.color = "red";
            }
        });
    });
});
/**
 * Alterna a visibilidade do campo de senha e atualiza o ícone de olho.
 *
 * @param evento Evento de clique no ícone de olho.
 */
const trocaOlho = (evento) => {
    const target = evento.target;
    const inputId = target.id === 'eyeIconNovaSenha' ? 'novaSenha' : 'confirmarSenha';
    const input = document.getElementById(inputId);
    if (input.type === "password") {
        input.type = "text";
        target.src = "../img/eye-open.svg";
    }
    else {
        input.type = "password";
        target.src = "../img/eye-off.svg";
    }
};
