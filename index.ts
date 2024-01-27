import express from "express";
import helmet from "helmet";
import cookieSession from "cookie-session";
import bodyParser from "body-parser";
import {passport} from "./src/utils/passport";
import { healthcheckRoute } from "./src/routes/routes";
import { authRoutes } from "./src/routes/user.routes";

const app = express();
require('./src/utils/passport');
const port: number = parseInt(process.env.PORT as string, 10) || 8000;

app.use(bodyParser.json());
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [process.env.cookieKey || "your-secret-key"],
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", healthcheckRoute);
app.use("/", authRoutes);

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

// https.createServer({
//     key:fs.readFileSync('key.pem'),
//     cert: fs.readFileSync('cert.pem')
// }, app).listen(port, ()=>{
//     console.log(`server listening on https://localhost:${port}`)
// })
