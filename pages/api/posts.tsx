// @ts-nocheck
import clientPromise from "../../mongodb";

export default async function handler(req, res) {
    const client = await clientPromise;
    const db = client.db("Database");
    switch (req.method) {
        case "POST":
            let bodyObject = JSON.parse(req.body);
            let newPost = await db
                .collection("RequestsAndResponses")
                .insertOne(bodyObject);
            res.json(newPost.ops[0]);
            break;
        case "GET":
            const posts = await db
                .collection("RequestsAndResponses")
                .find({})
                .toArray();
            res.json(posts);
            break;
    }
}
