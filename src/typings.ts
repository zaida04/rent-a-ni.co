import { FastifyReply, FastifyRequest, RequestGenericInterface } from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';
import { Knex } from 'knex';

export interface APPLICATION_CONTEXT {
	PORT: number;
	DATABASE: Knex;
	ALLOWED_IP: string;
	JWT_KEY: string;
}

// types for routes
export interface ACCOUNT_CREATE extends RequestGenericInterface {
	Body: {
		email: string;
		username: string;
		password: string;
	};
}

export interface ACCOUNT_LOGIN extends RequestGenericInterface {
	Body: {
		username: string;
		password: string;
	};
}

export interface REDIRECT_GET extends RequestGenericInterface {
	Params: {
		nanoId: string;
	};
}

export interface REDIRECT_CREATE extends RequestGenericInterface {
	Body: {
		destination: string;
	};
	Response: {
		id: string;
		shorthand_id: string;
	};
}

export interface HOME_GET extends RequestGenericInterface {
	Response: {
		message: string;
	};
}

export interface REDIRECT_DELETE extends RequestGenericInterface {
	Params: {
		nanoId: string;
	};
	Response: {
		id: string;
		shorthand_id: string;
	};
}

// database link entry
export interface ILink {
	id: string;
	nanoId: string;
	destination: string;
	created_at: number;
	updated_at: number;
}

// database user entry
export interface IUser {
	id: string;
	email: string;
	username: string;
	password: string;
	token: string;
	tokenLastUpdatedAt: string;
	created_at: number;
	updated_at: number;
}

// Request object extendable with a route interface like defined above, that way you have fully typed headers, body, queryparams
export type Req<T extends RequestGenericInterface> = FastifyRequest<T, Server, IncomingMessage>;

// Response object extendable with a route interface like defined above
export type Res<T extends RequestGenericInterface> = FastifyReply<
	Server,
	IncomingMessage,
	ServerResponse,
	T,
	unknown
>;
