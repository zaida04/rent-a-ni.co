declare namespace NodeJS {
	export interface ProcessEnv {
		DATABASE_URL: string;
		PORT: string;
		NODE_ENV?: string;
		ALLOWED_IP: string;
	}
}
