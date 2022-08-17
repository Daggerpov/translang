// @ts-nocheck
import clientPromise from "../../mongodb";

export default async function handler(req, res) {
    const client = await clientPromise;
    const db = client.db("Database");
    switch (req.method) {
        case "POST":
            let bodyObject = JSON.parse(req.body);
            let newUser = await db
                .collection("UserInfo")
                .insertOne(bodyObject);
            res.json(newUser.ops[0]);
            break;
        case "GET":
            const users = await db
                .collection("UserInfo")
                .find({})
                .toArray();
            res.json(users);
            break;
    }
}
