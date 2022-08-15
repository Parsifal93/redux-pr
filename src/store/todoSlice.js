import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchTodos = createAsyncThunk(
  "todos/fetchTodos",
  async function (_,{rejectWithValue}) {
    try {      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos_limit=10"
      );
      console.log(response);

      if(!response.ok) {
        throw new Error('Server Error');
      }

      const data = await response.json();

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
  }
});

const todoSlice = createSlice({
  name: "todos",
  initialState: {
    todos: [],
    status: null,
    errors: null,
  },
  reducers: {
    addTodo(state, action) {
      state.todos.push({
        id: new Date().toISOString(),
        text: action.payload.text,
        comleted: false,
      });
    },
    removeTodo(state, action) {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload.id);
    },
    toggleTodoComplete(state, action) {
      const toggleTodo = state.todos.find(
        (todo) => todo.id === action.payload.id
      );
      toggleTodo.comleted = !toggleTodo.comleted;
    },
  },
  extraReducers: {
    [fetchTodos.pending]: (state, action) => {
      state.status = "loading";
      state.error = null;
    },
    [fetchTodos.fulfilled]: (state, action) => {
      state.status = "resolved";
      state.todos = action.payload;
    },
    [fetchTodos.rejected]: (state, action) => {
      state.status = "rejected";
      state.error = action.payload;
    },
  },
});

export const { addTodo, removeTodo, toggleTodoComplete } = todoSlice.actions;

export default todoSlice.reducer;
