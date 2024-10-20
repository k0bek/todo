"use client";

import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { addName } from "@/utils/actions/addName";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const addNameSchema = z.object({
  name: z
    .string()
    .min(1, "Imię nie może być puste")
    .max(100, "Imię nie może być dłuższe niż 100 znaków"),
});

type FormData = z.infer<typeof addNameSchema>;

const AddNameForm = () => {
  const router = useRouter();

  const { mutate: addNameMutate, isPending: addNameMutatePending } =
    useMutation({
      mutationFn: addName,
      onSuccess: (data) => {
        if (data?.id) {
          router.push(data.id);
        }
        toast.success("Imię zostało dodane");
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
    resolver: zodResolver(addNameSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = handleSubmit((data) => {
    addNameMutate({ name: data.name });
    reset();
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full flex justify-center items-center flex-col"
    >
      <div className="p-3 sm:p-6 bg-white rounded-lg border shadow-lg w-full max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Twoje imię
        </h1>
        <form onSubmit={onSubmit} className="mb-4">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col">
              <input
                type="text"
                placeholder="Dodaj swoje imię..."
                className="flex-grow px-4 py-2 text-gray-700 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("name")}
              />
              {errors.name && (
                <span className="text-red-500 text-sm mt-2">
                  {errors.name.message}
                </span>
              )}
            </div>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-primary rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:bg-primary/50 disabled:cursor-not-allowed"
              disabled={addNameMutatePending}
            >
              {addNameMutatePending ? "Przetwarzanie..." : "Wejdź"}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default AddNameForm;
