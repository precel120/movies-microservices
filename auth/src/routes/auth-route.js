const express = require("express");
const { authFactory, AuthError } = require("../auth");

const { JWT_SECRET } = process.env;

const router = express.Router();
const auth = authFactory(JWT_SECRET);

router.post("/auth", (req, res, next) => {
	if (!req.body) {
		return res.status(400).json({ error: "invalid payload" });
	}

	const { username, password } = req.body;

	if (!username || !password) {
		return res.status(400).json({ error: "invalid payload" });
	}

	try {
		const token = auth.GenerateToken(username, password);

		return res.status(200).json({ token });
	} catch (error) {
		if (error instanceof AuthError) {
		return res.status(401).json({ error: error.message });
		}

		next(error);
	}
});

router.get("/verify", (req, res, next) => {
	try {
		const validationData = auth.ValidateSignature(req);
		return res.status(200).json(validationData);
	} catch(error) {
		if (error instanceof AuthError) {
		return res.status(401).json({ error: error.message });
		}
		next(error);
	}
});

module.exports = router;