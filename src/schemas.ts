export const RESPONSES = {
	ACCOUNT_LOGIN: {
		schema: {
			body: {
				type: 'object',
				properties: {
					username: { type: 'string' },
					password: { type: 'string' }
				},
				required: ['username', 'password']
			},
			response: {
				404: {
					type: 'object',
					properties: {
						message: { type: 'string' }
					}
				},
				401: {
					type: 'object',
					properties: {
						message: { type: 'string' }
					}
				},
				200: {
					type: 'object',
					properties: {
						token: { type: 'string' }
					}
				}
			}
		}
	},
	ACCOUNT_CREATE: {
		schema: {
			body: {
				type: 'object',
				properties: {
					email: { type: 'string' },
					username: { type: 'string' },
					password: { type: 'string' }
				},
				required: ['email', 'username', 'password']
			},
			response: {
				409: {
					type: 'object',
					properties: {
						message: { type: 'string' }
					}
				},
				200: {
					type: 'object',
					properties: {
						token: { type: 'string' }
					}
				}
			}
		}
	},
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
			},
			headers: {
				type: 'object',
				properties: {
					authorization: {
						type: 'string'
					}
				},
				required: ['authorization']
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
			},
			headers: {
				type: 'object',
				properties: {
					authorization: {
						type: 'string'
					}
				},
				required: ['authorization']
			}
		}
	}
};
