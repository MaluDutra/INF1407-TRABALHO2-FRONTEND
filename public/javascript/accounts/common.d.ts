/**
 * Executa requisições HTTP autenticadas, injetando o token de acesso no cabeçalho.
 * Se o token estiver expirado, tenta atualizá-lo antes de enviar a requisição.
 *
 * @param url endpoint da requisição
 * @param options opções de fetch, como método e headers
 * @returns objeto Response da requisição fetch
 */
export declare const authFetch: (url: string, options?: RequestInit) => Promise<Response>;
//# sourceMappingURL=common.d.ts.map