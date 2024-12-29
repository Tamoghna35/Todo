import Router from "express";
import { createTodo, updateTodo, deleteTodo, taskByDue_date } from "../controllers/to.controller.js";
const router = Router()

router.route("/add_Task").post(createTodo)
router.route("/update_task/:task_id").put(updateTodo)
router.route("/delete_task/:task_id").delete(deleteTodo)
router.route("/agenda").get(taskByDue_date)

export default router