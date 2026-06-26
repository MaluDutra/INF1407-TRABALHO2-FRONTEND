export declare const MOCK_MODE = true;
export declare const API_BASE_URL = "http://127.0.0.1:8000/api";
type Metodo = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export declare class ApiError extends Error {
    status: number;
    constructor(status: number, message: string);
}
export declare function apiRequest<T>(caminho: string, metodo?: Metodo, corpo?: unknown): Promise<T>;
export {};
//# sourceMappingURL=api.d.ts.map