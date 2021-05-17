import { FastifyReply, FastifyRequest, RequestGenericInterface } from 'fastify';
import { RouteGenericInterface } from 'fastify/types/route';
import { Server, IncomingMessage, ServerResponse } from 'http';
import { Knex } from 'knex';

export interface APPLICATION_CONTEXT {
	PORT: number;
	DATABASE: Knex;
}

export interface REDIRECT_CREATE_BODY {
	destination: string;
}

export interface REDIRECT_CREATE_RESPONSE {
	id: string;
	shorthand_id: string;
}

export interface HOME_GET_RESPONSE {
	message: string;
}

export interface REDIRECT_DELETE_RESPONSE {
	id: string;
	shorthand_id: string;
}

export type Req = FastifyRequest<RequestGenericInterface, Server, IncomingMessage>;
export type Res = FastifyReply<Server, IncomingMessage, ServerResponse, RouteGenericInterface, unknown>;
