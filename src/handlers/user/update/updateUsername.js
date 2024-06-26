// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.


import failureCONTENT from "../../../responses/raw/failure-CONTENT";
import successEMPTY from "../../../responses/raw/success-EMPTY";
import {createHttpClient} from "../../../HttpClient";

import Filter from "bad-words";
const filter = new Filter();

export default async (request, env) => {
	try {
		const http = createHttpClient(env, request.accesstoken);
		if (await env.UsernameChangeTimelimit.get(request.userid)) {return failureCONTENT(env,`ERR_CANNOT_YET_CHANGE`, 400)}
		const usernameRegex = new RegExp(/^[a-zA-Z0-9]{3,24}$/)
		const requestData = await request.json();
		if (usernameRegex.test(requestData.username)) {return failureCONTENT(env,'ERR_INVALID_USERNAME', 406);}
		if (filter.isProfane(requestData.username)) {return failureCONTENT(env,'ERR_CONTAINS_BAD_WORDS', 406)}
		await http.patch(
			`/api/users/${request.userid}`,
			{data: {"username": requestData.username}
			});
		const monthFromNow = Math.floor(new Date(new Date().setMonth(new Date().getMonth() + 1)).getTime() / 1000);
		const formattedDate = new Date(monthFromNow * 1000)
		await env.UsernameChangeTimelimit.put(request.userid, [('0' + formattedDate.getDate()).slice(-2), ('0' + (formattedDate.getMonth() + 1)).slice(-2), formattedDate.getFullYear().toString().slice(-2)].join('/'), {expirationTtl: monthFromNow})
		return successEMPTY(env)
	} catch (e) {
		console.error(e)
		return failureCONTENT(env, e.message, e.status)	}
}
