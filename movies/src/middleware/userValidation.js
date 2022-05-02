const axios = require("axios");

const ValidateUser = async (req, res, next) => {
	try {
		const authHeader = req.get("Authorization");
		if (!authHeader) {
			return res.status(403).json({message: 'Auth header missing'});
		}
		const config = {
			headers: { Authorization: authHeader }
		};
		const retrievedData = await axios.get("http://auth:3000/verify", config);
		const { data } = retrievedData;
		const { isAuthorized, decoded } = data;
		console.log(decoded);
		if (isAuthorized) {
			req.user = decoded;
			return next();
		}
	} catch(error) {
		return res.status(403).json({message: 'Not Authorized'});
	}
}

module.exports = ValidateUser;