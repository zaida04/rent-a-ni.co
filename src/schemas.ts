export const RESPONSES = {
	HOME: {
		schema: {
			response: {
				200: {
					type: 'object',
					properties: {
						message: { type: 'string' }
					}
				}
			}
		}
	},
	REDIRECT_DELETE: {
		schema: {
			response: {
				200: {
					type: 'object',
					properties: {
						id: { type: 'string' },
						shorthand_id: { type: 'string' }
					}
				}
			}
		}
	},
	REDIRECT_GET: {
		schema: {
			body: {
				type: 'object',
				properties: {}
			}
		}
	},
	REDIRECT_CREATE: {
		schema: {
			body: {
				type: 'object',
				properties: {
					destination: { type: 'string' }
				}
			},
			response: {
				200: {
					type: 'object',
					properties: {
						shorthand_id: { type: 'string' },
						id: { type: 'string' }
					}
				}
			}
		}
	}
};
