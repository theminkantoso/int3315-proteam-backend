export interface IGoogleLoginBody {
    code: string;
    redirectUri: string;
}

export interface IGoogleLoginLinkQuery {
    state: string;
    redirectUri: string;
}
