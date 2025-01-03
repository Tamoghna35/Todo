/** @format */

import { Op } from "sequelize";

import { Task } from "../models/index.js";

export const createTodo = async (req, res) => {
    try {
        const { task_id, task_name, category, priority, status, due_date } =
            req.body;

        if (
            !task_id ||
            !task_name ||
            !category ||
            !priority ||
            !status ||
            !due_date
        ) {
            return res.status(400).json({ error: "Required fields are missing" });
        }

        const existingTask = await Task.findOne({ where: { task_id } });
        if (existingTask) {
            return res.status(409).json({ error: "Task already exists" });
        }

        const newTask = {
            task_id,
            task_name,
            category,
            priority,
            status,
            due_date,
        };

        const createdTask = await Task.create(newTask);
        if (!createdTask) {
            return res
                .status(500)
                .json({ error: "Task could not be created in the database" });
        }

        return res
            .status(201)
            .json({ message: "Task created successfully", createdTask });
    } catch (error) {
        console.error("Error in createTodo:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const updateTodo = async (req, res) => {
    try {
        const { task_id } = req.params;
        console.log("task_id ===>", task_id);

        if (!task_id) {
            return res.status(400).json({ error: `task_id is not provided` });
        }
        const { task_name, category, priority, status, due_date } = req.body;
        if (!task_name && !category && !priority && !status && !due_date) {
            return res
                .status(400)
                .json({ error: `Provide atleast one required fields` });
        }

        const existingTodo = await Task.findOne({ where: { task_id } });
        if (!existingTodo) {
            return res.status(400).json({ error: `Todo is not prsent` });
        }
        // const updatedTask = await Task.update(
        //     {
        //         task_name: task_name || existingTodo.task_name,
        //         category: category || existingTodo.category,
        //         priority: priority || existingTodo.priority,
        //         status: status || existingTodo.status,
        //         due_date: due_date || existingTodo.due_date,
        //     },
        //     {
        //         where: { task_id: existingTodo.task_id },
        //     }
        // );
        const updatedFields = {};
        if (task_name) updatedFields.task_name = task_name;
        if (category) updatedFields.category = category;
        if (priority) updatedFields.priority = priority;
        if (status) updatedFields.status = status;
        if (due_date) updatedFields.due_date = due_date;

        const updatedTask = await Task.update(updatedFields, {
            where: { task_id },
        });

        console.log("updatedTask ===>", updatedTask);

        if (!updatedTask > 0) {
            return res.status(400).json({ erroe: ` Issue in updateing task in db` });
        }
        return res.status(200).json({ message: `Task is updated`, updatedTask });
    } catch (error) {
        console.log(`Error in updating Todo`, error.message);
        return res.status(500).json({ error: "Inrernal server error" });
    }
};

// Path: /todos/: todoId /

export const deleteTodo = async (req, res) => {
    const { task_id } = req.params;

    try {
        const existingTodo = await Task.findByPk(task_id);
        if (!existingTodo) {
            return res.status(400).json({ error: "Task id is not present in Db" });
        }

        const deleteItem = await Task.destroy({ where: { task_id } });
        console.log("deleteItem ===>", deleteItem);
        if (deleteItem > 0) {
            return res.status(200).json({
                message: `task ${existingTodo.task_name} is deleted successfully`,
            });
        }
    } catch (error) {
        return res.status(500).json({ error: "Error in deleting task" });
    }
};

//Returns a list of all todos with a specific due date in the query parameter /agenda/?date=2021-02-22

export const taskByDue_date = async (req, res) => {
    const { due_date } = req.query;

    const startOfDay = new Date(due_date);
    const endOfDay = new Date(due_date);
    endOfDay.setHours(23, 59, 59, 999);

    const taskList = await Task.findAll({
        attributes: [
            "task_id",
            "task_name",
            "category",
            "priority",
            "status",
            "due_date",
        ],
        where: {
            due_date: {
                [Op.between]: [startOfDay, endOfDay],
            },
        },
    });
    console.log("TaskList==>", taskList);
    const formated_task_list = taskList.map((list) => ({
        task_id: list.task_id,
        task_name: list.task_name,
        category: list.category,
        priority: list.priority,
        status: list.status,
        due_date: list.due_date,
    }));

    if (!formated_task_list) {
        return res
            .status(400)
            .json({ message: "No task is present in the duedate" });
    }
    return res.status(200).json({
        message: `Task list`,
        tasks: formated_task_list,
    });
};

// Path: /todos/: todoId /    Method: GET   Description: Returns a specific todo based on the todo ID

export const todoBasedOnId = async (req, res) => {
    const { todoId } = req.params;
    const task_id = todoId;
    if (!task_id) {
        return res.status(400).json({ erroe: `task_id is not provoded` });
    }

    const whereCondition = { task_id };

    const task = await Task.findOne({ where: whereCondition });
    if (!task) {
        return res.status(400).json({ error: `Task not find` });
    }
    return res.status(200).json({
        message: `the task is: `,
        task: task,
    });
};

// todo basd on condition

export const todoBasedOnCondition = async (req, res) => {
    const { category, priority, status, search_q } = req.query;

    if (!category && !priority && !status && !search_q) {
        return res
            .status(400)
            .json({ error: "Atleast one parameter should be provided" });
    }

    const whereCondition = {};

    if (category) {
        whereCondition.category = category;
    }

    if (priority) {
        whereCondition.priority = priority;
    }

    if (status) {
        whereCondition.status = status;
    }
    if (search_q) {
        whereCondition.task_name = { [Op.like]: `%${search_q}%` };
    }

    const taskList = await Task.findAll({ where: whereCondition });
    console.log("Task List ===>", taskList);

    const formatedTaskList = taskList.map((taskItem) => ({
        task_id: taskItem.task_id,
        task_name: taskItem.task_name,
        category: taskItem.category,
        priority: taskItem.priority,
        status: taskItem.status,
        due_date: taskItem.due_date,
    }));

    return res.status(200).json({
        message: "Task list",
        data: formatedTaskList,
    });
};
