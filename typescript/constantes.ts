// constantes.ts

// export const backendAddress = 'http://127.0.0.1:8000/';
export const backendAddress = 'https://psychic-space-eureka-px9rj7gx565f74j4-8000.app.github.dev/';

export interface JwtResposta {
    access: string; // token de acesso
    refresh: string; // token para obter novo token de acesso quando o atual expirar
}
