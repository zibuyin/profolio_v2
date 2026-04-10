const express = require("express");
const crypto = require("crypto");
const { exec } = require("child_process");

const app = express();
app.use(express.json());

const SECRET = ""

function verifySignature(req) {
    const signature = req.headers["x-hub-signature-256"];
    if (!signature) return false;

    const hmac = crypto.createHmac("sha256", SECRET);
    const digest = "sha256=" + hmac.update(JSON.stringify(req.body)).digest("hex");

    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

app.post("/deploy", (req, res) => {
    if (!verifySignature(req)) {
        return res.status(403).send("Invalid signature");
    }

    console.log("🚀 Deploy triggered");

    exec("/home/nathan/projects/profolio_v2/deploy.sh", (err, stdout, stderr) => {
        if (err) {
            console.error("❌ Deploy failed:", err);
            return;
        }
        console.log(stdout);
    });

    res.send("Deploy started");
});

app.listen(3000, () => console.log("Listening on port 3000"));