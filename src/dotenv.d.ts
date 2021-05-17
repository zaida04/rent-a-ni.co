declare namespace NodeJS {
	export interface ProcessEnv {
		DATABASE_URI: string;
		PORT: string;
		NODE_ENV?: string;
	}
}
