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
	REDIRECT_CREATE: {
		schema: {
			body: {
				type: 'object',
				properties: {
					destination: { type: 'string' }
				},
				required: ['destination']
			},
			response: {
				200: {
					type: 'object',
					properties: {
						nanoId: { type: 'string' },
						id: { type: 'string' }
					}
				}
			}
		}
	}
};
