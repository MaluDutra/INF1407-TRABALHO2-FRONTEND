/**
 * Função para fazer requisições HTTP autenticadas usando o token de acesso.
 * Antes de fazer a requisição, verifica se o token de acesso expirou.
 * Se o token de acesso expirou, tenta atualizar o token usando o token de refresh.
 * Se a atualização do token for bem-sucedida, a requisição é feita com o novo token de acesso.
 * Se a atualização do token falhar, a requisição é feita sem o token de acesso.
 *
 * @param url endereço do endpoint
 * @param options cabeçalhos da requisição http
 * @returns o resultado da requisição http feita usando fetch
 */
export declare const authFetch: (url: string, options?: RequestInit) => Promise<Response>;
//# sourceMappingURL=common.d.ts.map