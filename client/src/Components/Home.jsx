import { useContext, useEffect, useState } from "react";
import UserContext from "../context/UserContext";
import axios from "axios";

function Home() {
  const userInfo = useContext(UserContext);

  const [todo, setTodo] = useState("");
  const [todoList, setTodoList] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/todos", { withCredentials: true })
      .then((response) => {
        setTodoList(response.data);
      });
  }, []);

  const addTodo = async (event) => {
    event.preventDefault();
    await axios
      .put(
        "http://localhost:8000/todos",
        { text: todo },
        { withCredentials: true }
      )
      .then((response) => {
        setTodoList([...todoList, response.data]);
        setTodo("");
      });
  };

  const checkTodo = async (todo) => {
    await axios
      .post(
        "http://localhost:8000/todos",
        { id: todo._id, done: !todo.done },
        { withCredentials: true }
      )
      .then(() => {
        const newTodoList = todoList.map((item) => {
          if (item._id === todo._id) {
            item.done = !item.done;
          }
          return item;
        });
        setTodoList(newTodoList);
      });
  };

  if (!userInfo.email) {
    return (
      <div className="w-screen mt-[100px] text-center text-4xl">
        Please login to see this page.
      </div>
    );
  }
  return (
    <div className="w-screen flex flex-col items-center mt-[100px] text-4xl ">
      <form onSubmit={(event) => addTodo(event)}>
        <input
          type="text"
          value={todo}
          onChange={(event) => setTodo(event.target.value)}
          placeholder="Add a todo"
          className="border border-green-300"
        />
      </form>
      <ul>
        {todoList.map((item) => (
          <li
            key={item._id}
            className="flex flex-row items-center gap-[20px] mt-[20px]"
          >
            <input
              type="checkbox"
              checked={item.done}
              onChange={() => {
                checkTodo(item);
              }}
            />
            <p>{item.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
