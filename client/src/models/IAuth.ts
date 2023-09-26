export interface IAuth {
    login: string;
    password: string;
}

export interface ITokens {
    tokens: {
        refreshToken: string;
        accessToken: string;
    };
}


