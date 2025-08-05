import { Router } from "express";
import { userRouter } from "./users.routes";

/* GET home page. */
const router = Router();

router.get("/", function(req, res) {
  res.render("index", { title: "Express" });
});
router.use("/api/v1.0/users", userRouter);

export const rootRouter = router;
