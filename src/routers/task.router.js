/** @format */

import Router from "express";
import {
    createTodo,
    updateTodo,
    deleteTodo,
    taskByDue_date,
    todoBasedOnId,
    todoBasedOnCondition
} from "../controllers/to.controller.js";
const router = Router();

router.route("/add_Task").post(createTodo);
router.route("/update_task/:task_id").put(updateTodo);
router.route("/delete_task/:task_id").delete(deleteTodo);
router.route("/agenda").get(taskByDue_date);
router.route("/todos/:todoId").get(todoBasedOnId);
router.route("/todos/").get(todoBasedOnCondition);

export default router;
