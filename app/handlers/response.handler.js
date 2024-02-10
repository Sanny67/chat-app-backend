export const response = (res, status, success, message, data) => {
	const response = { status, success, message };
	if (data) {
		response.data = data;
	}
	return res.status(status).json(response);
};
