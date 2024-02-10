export const ErrorCode = {
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	NOT_FOUND: 404,
	FORBIDDEN: 403,
	DUPLICATE_DATA: 409,
	UNKNOWN_ERROR: 500,
}

export const throwError = (message, status) => {
	const error = new Error(message);
	error.status = status;
	throw error;
};

export const throwFirebaseError = (message, status) => {
	const error = new Error(message);
	error.status = status;
	return error;
};
