import { FastifyReply, FastifyRequest, RequestGenericInterface } from 'fastify';
import { RouteGenericInterface } from 'fastify/types/route';
import { Server, IncomingMessage, ServerResponse } from 'http';
import { Knex } from 'knex';

export interface APPLICATION_CONTEXT {
	PORT: number;
	DATABASE: Knex;
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

export interface ILink {
	id: string;
	nanoId: string;
	destination: string;
	created_at: number;
	updated_at: number;
}

export type Req<T extends RequestGenericInterface> = FastifyRequest<T, Server, IncomingMessage>;
export type Res<T extends RequestGenericInterface> = FastifyReply<
	Server,
	IncomingMessage,
	ServerResponse,
	T,
	unknown
>;