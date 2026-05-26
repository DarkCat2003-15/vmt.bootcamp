export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    token: string;
}

export interface JwtPayload {
    sub: number;
    user: string;
    iat: number;
}