import { Router } from "express";
import { get, run } from "../db/helpers";
import { User } from "../types";

const router = Router();

//POST route, log in with email only
router.post("/login", async (req, res) => {
    const { email } = req.body;
    if (!email) {
        res.status(400).json({ error: "email required" });
        return;
    }

    const user = await get<User>("SELECT * FROM users WHERE email = ?", [email.trim()]);
    if (!user) {
        res.status(404).json({ error: "no account found with given email"});
        return;
    }

    res.json(user);
});

//POST route, create a new user account
router.post("/register", async (req, res) => {
    const { firstName, lastName, email, phoneNumber } = req.body;
    if (!firstName || !lastName || !email || !phoneNumber) {
        res.status(400).json({ error: "firstName, lastName, email, and phoneNumber are all required" });
        return;
    }

    const existing = await get<User>("SELECT * FROM users WHERE email = ?", [email.trim()]);
    if (existing) {
        res.status(409).json({ error: "account with that email already exists" });
        return;
    }

    await run(
        "INSERT INTO users (firstName, lastName, email, phoneNumber) VALUES (?, ?, ?, ?)",
        [firstName.trim(), lastName.trim(), email.trim(), phoneNumber.trim()]
    );

    const user = await get<User>("SELECT * FROM users WHERE email = ?", [email.trim()]);
    res.status(201).json(user);
});

export default router;
