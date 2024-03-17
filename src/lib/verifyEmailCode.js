export default async function verifyEmailCode(env, accessToken, userEmail, verificationCode) {
	const url = `${env.LOGTO_DOMAIN}/api/verification-codes/verify`;
	const headers = {
		'Authorization': `Bearer ${accessToken}`,
		'Content-Type': 'application/json',
	};
	const body = JSON.stringify({ email: userEmail, "verificationCode": verificationCode });
	try {
		const response = await fetch(url, { method: 'POST', headers, body });
		if (!response.ok) {
			throw { message: 'Failed to access resource due to network error - ERR 4892', status: response.status };
		}
		return response;
	} catch (error) {
		console.error('Error accessing resource:', error);
		throw typeof error === 'string' ? { message: error, status: 500 } : error;
	}
}