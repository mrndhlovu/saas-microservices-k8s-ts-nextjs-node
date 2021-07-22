import { Application } from "express";
import { IUserDocument } from "@tuskui/shared";
export interface IUserJwtPayload {
    user?: IUserDocument;
    token: string;
}
export declare type RolesType = "admin" | "basic" | "guest";
export interface IRoleOptions {
    [role: string]: RolesType;
}
export interface IConfigTypes {
    port: number;
    host: string;
    apiUri: string;
    authUri: string;
}
export interface IExtendedServer extends Application {
    close: any;
}
export interface IObjectAuthTokenToSign {
    userId: string;
    email: string;
}
export interface IJwtRefreshTokens {
    access: string;
    refresh: string;
}
export interface IBoardRoleJwtToken {
    admin: string;
    flag: number;
}
export interface IJwtAccessTokens {
    access: string;
    refresh: string;
}
export declare type JWTSignKeyOption = "refresh" | "role" | "access";
export interface IJwtAuthToken {
    userId: string;
    email: string;
}
