import { apiRequest, ApiError } from "./api.js";
import { renderNav } from "./nav.js";

renderNav("nav");

const parametros = new URLSearchParams(window.location.search);
const token = parametros.get("token") ?? "";

const form = document.getElementById("form-redefinir-senha") as HTMLFormElement;
const campoSenhaNova = document.getElementById("senha-nova") as HTMLInputElement;
const campoSenhaConfirma = document.getElementById("senha-confirma") as HTMLInputElement;
const mensagemErro = document.getElementById("mensagem-erro") as HTMLParagraphElement;
const mensagemSucesso = document.getElementById("mensagem-sucesso") as HTMLParagraphElement;

if (!token) {
  mensagemErro.textContent = "Link inválido ou expirado. Solicite uma nova redefinição de senha.";
  form.querySelectorAll("input, button").forEach((elemento) => {
    (elemento as HTMLInputElement | HTMLButtonElement).disabled = true;
  });
}

form.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  mensagemErro.textContent = "";
  mensagemSucesso.textContent = "";

  if (campoSenhaNova.value !== campoSenhaConfirma.value) {
    mensagemErro.textContent = "A confirmação não corresponde à nova senha.";
    return;
  }

  try {
    await apiRequest("/redefinir-senha/", "POST", {
      token,
      senha_nova: campoSenhaNova.value,
    });
    mensagemSucesso.textContent = "Senha redefinida com sucesso! Você já pode fazer login.";
    form.reset();
  } catch (erro) {
    if (erro instanceof ApiError) {
      mensagemErro.textContent = erro.message;
    } else {
      mensagemErro.textContent = "Não foi possível redefinir a senha.";
    }
  }
});
