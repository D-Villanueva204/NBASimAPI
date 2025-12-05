export interface AuthorizationOptions {
    hasRole: Array<"admin" | "coach" | "user">;
    allowSameUser?: boolean;
}

