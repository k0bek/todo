"use client";

import React, { useState } from "react";
import { Trash2, Edit2, Check, X } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { useGetTasks } from "@/utils/hooks/useGetTasks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTask } from "@/utils/actions/deleteTask";
import { addTask } from "@/utils/actions/addTask";
import { updateTask } from "@/utils/actions/updateTask";
import { useParams } from "next/navigation";
import { useGetUser } from "@/utils/hooks/useGetUser";
import { TodoT } from "../types";
import toast from "react-hot-toast";
import { cn } from "@/utils";

const newTodoSchema = z.object({
  text: z
    .string()
    .min(1, "Zadanie nie może być puste")
    .max(100, "Zadanie nie może być dłuższe niż 100 znaków"),
});

type FormData = z.infer<typeof newTodoSchema>;

const TodoList = () => {
  const params = useParams();
  const queryClient = useQueryClient();
  const userId = params.userId as string;
  const { data: tasks } = useGetTasks({ userId });
  const { data: currentUser } = useGetUser({ userId });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const { mutate: deleteMutate } = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      toast.success("Zadanie zostało usunięte");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: addTaskMutate } = useMutation({
    mutationFn: addTask,
    onSuccess: () => {
      toast.success("Zadanie zostało dodane");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: updateTaskMutate } = useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      toast.success("Zadanie zostało zaktualizowane");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(newTodoSchema),
    defaultValues: { text: "" },
  });

  const onSubmit = handleSubmit((data) => {
    addTaskMutate({ text: data.text, userId });
    reset();
  });

  const startEditing = (id: string, text: string) => {
    setEditingId(id);
    setEditText(text);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditText("");
  };

  const saveEdit = (id: string, isChecked: boolean) => {
    if (editText.trim()) {
      updateTaskMutate({ id, text: editText, is_checked: isChecked });
      cancelEditing();
    }
  };

  const toggleTaskStatus = (todo: TodoT) => {
    updateTaskMutate({
      id: todo.id,
      is_checked: !todo.is_checked,
      text: todo.text,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full flex justify-center items-center flex-col mx-10"
    >
      <p className="text-3xl sm:text-5xl font-semibold mb-6">
        Cześć <span className="text-blue-300">{currentUser?.name}</span>!
      </p>

      <div className="p-3 sm:p-6 bg-white rounded-lg border shadow-lg w-full max-w-xl">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Lista zadań
        </h1>
        <form onSubmit={onSubmit} className="mb-4">
          <div className="flex flex-col">
            <div className="flex">
              <input
                type="text"
                placeholder="Dodaj nowe zadanie..."
                className="flex-grow px-4 py-2 text-gray-700 bg-gray-200 rounded-l-lg focus:outline-none"
                {...register("text")}
              />
              <button
                type="submit"
                className="px-4 py-2 text-white bg-primary rounded-r hover:bg-blue-700 focus:outline-none transition-all"
              >
                Dodaj
              </button>
            </div>
            {errors.text && (
              <span className="text-red-500 text-sm mt-2">
                {errors.text.message}
              </span>
            )}
          </div>
        </form>
        <ul>
          <AnimatePresence>
            {tasks?.map((todo: TodoT) => (
              <motion.li
                key={todo.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between p-3 bg-gray-100 rounded mb-2"
              >
                <div className="flex items-center flex-grow">
                  <input
                    type="checkbox"
                    checked={todo.is_checked}
                    onChange={() => toggleTaskStatus(todo)}
                    className="mr-3 cursor-pointer"
                  />
                  {editingId === todo.id ? (
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="flex-grow px-2 py-1 text-gray-700 bg-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <span
                      className={cn(
                        todo.is_checked
                          ? "line-through text-gray-500"
                          : "text-gray-800"
                      )}
                    >
                      {todo.text}
                    </span>
                  )}
                </div>
                <div className="flex items-center">
                  {editingId === todo.id ? (
                    <>
                      <button
                        onClick={() => saveEdit(todo.id, todo.is_checked)}
                        className="text-green-500 hover:text-green-700 mr-2 p-1"
                      >
                        <Check size={18} />
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="text-red-500 hover:text-red-700 mr-2 p-1"
                      >
                        <X size={18} />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => startEditing(todo.id, todo.text)}
                      className="text-primary hover:text-blue-700 mr-2 p-1"
                    >
                      <Edit2 size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => deleteMutate({ id: todo.id })}
                    className="text-red-500 hover:text-red-700 hover:scale-105 p-1"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </motion.div>
  );
};

export default TodoList;
