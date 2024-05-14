import failedResponseWithMessage from "../responses/failedResponseWithMessage";


export default async function (env, accessToken, userData, userId) {
	const url = `${env.LOGTO_DOMAIN}/api/users/${userId}/profile`;
	const headers = {
		'Authorization': `Bearer ${accessToken}`,
		'Content-Type': 'application/json',
	};
	const body = JSON.stringify(userData);
	const response = await fetch(url, { method: 'PATCH', headers, body });
	if (!response.ok) {
		console.error('Error accessing resource:', response.statusText);
		throw { message: 'Failed to access resource - Trace ID: 584679', status: response.status };
	}
	return response;
}