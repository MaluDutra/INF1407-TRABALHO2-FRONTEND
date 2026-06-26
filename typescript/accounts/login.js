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
 * Inicializa o formulário de login quando a página é carregada.
 * Captura as credenciais do usuário e tenta autenticar no backend.
 */
onload = () => {
    const form = document.getElementById("loginForm");
    form.addEventListener("submit", (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        const msg = document.getElementById("msg");
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        try {
            const tokens = yield login(username, password);
            // Armazena os tokens JWT no localStorage para uso nas próximas requisições
            localStorage.setItem("access_token", tokens.access);
            localStorage.setItem("refresh_token", tokens.refresh);
            window.location.href = (0, constantes_js_1.getBasePath)() + "index.html";
        }
        catch (err) {
            msg.textContent = "Usuário ou senha inválidos";
        }
    }));
};
/**
 * Envia as credenciais ao backend para obter um par de tokens JWT.
 *
 * @param username nome de usuário informado no formulário
 * @param password senha informada no formulário
 * @returns Promise que resolve para o objeto de tokens JWT
 */
function login(username, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(constantes_js_1.backendAddress + "api/token/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });
        if (!response.ok) {
            throw new Error("Login inválido");
        }
        return yield response.json();
    });
}
