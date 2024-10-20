import TodoList from "../components/TodoList";

export default function Home() {
  return (
    <div className="h-screen bg-gradient-to-b from-violet-500 via-indigo-500 to-blue-600 relative flex justify-center items-center">
      <TodoList />
    </div>
  );
}
