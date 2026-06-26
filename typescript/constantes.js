"use strict";
// constantes.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBasePath = exports.backendAddress = void 0;
// export const backendAddress = 'http://127.0.0.1:8000/';
// export const backendAddress = 'https://psychic-space-eureka-px9rj7gx565f74j4-8000.app.github.dev/';
exports.backendAddress = 'https://inf1407-backend.onrender.com/';
/**
 * Base path para as rotas do site.
 * No GitHub Pages, é necessário incluir o nome do repositório (/INF1407-TRABALHO2-FRONTEND/)
 * Em desenvolvimento local, é apenas a raiz (/)
 */
function getBasePath() {
    const pathname = window.location.pathname;
    // Se a URL contém INF1407-TRABALHO2-FRONTEND, estamos no GitHub Pages
    if (pathname.includes('INF1407-TRABALHO2-FRONTEND')) {
        return '/INF1407-TRABALHO2-FRONTEND/';
    }
    return '/';
}
exports.getBasePath = getBasePath;
