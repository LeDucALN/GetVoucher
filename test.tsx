/** @format */

// /** @format */

import express from "express";
import cors from "cors";
import axios from "axios";
import { log } from "console";

const app = express();
app.use(cors());
app.use(express.json());

const pattern1 = /\/tag\/([^/?]+)/;
const pattern2 = /\/catalog\/\?q=([^&]+)/;

const validChars =
	"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

app.get("/", async (req, res) => {
	const result: string[] = [];
	const urls: string[] = [];

	for (let char1 of validChars) {
		for (let char2 of validChars) {
			const url = `https://s.lazada.vn/l.G8${char1}${char2}`;
			urls.push(url);
		}
	}

	for (const url of urls) {
		try {
			await new Promise((resolve) => setTimeout(resolve, 100));
			const response = await axios.get(url);
			const urlPath = response.request.path;
			if (urlPath.includes("/tag")) {
				const match = urlPath.match(pattern1);
				if (match && !result.includes(match[1])) {
					result.push(match[1]);
				}
			} else if (urlPath.includes("/catalog")) {
				const match = urlPath.match(pattern2);
				if (match && !result.includes(match[1])) {
					result.push(match[1]);
				}
			} else {
				log(`Unknown path: ${urlPath} \n url: ${url}`);
			}
		} catch (error: any) {
			if (error.code === "ETIMEDOUT") {
				log(`Timeout when making request to ${url}`);
			} else {
				log(
					`Error occurred when making request to ${url}: ${error.message}`
				);
			}
		}
	}

	return res.send(result);
});

app.listen(3000, () => {
	log("Server is running at port 3000");
});
