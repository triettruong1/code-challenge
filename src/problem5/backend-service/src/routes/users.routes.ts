import { Router } from "express";
import { usersController } from "../controllers";

const router = Router();

router.route("/").get(usersController.getUsers).post(usersController.createUser);

router
  .route("/:id")
  .get(usersController.getUserById)
  .delete(usersController.deleteUser)
  .put(usersController.updateUser);

export const userRouter = router;
