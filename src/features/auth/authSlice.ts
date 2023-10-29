import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { IAuth } from "../../types"

interface IAuthInitialState {
  user: {
    _id: string
    firstName: string
    lastName: string
    email: string
    role: string
    profileImage: string
    token: string
  }
  isLoading: boolean
  isError: boolean
  error: string
}

interface ISignupUserPayload {
  email: string
  password: string
  firstName: string
  lastName: string
}

// Define the payload type for the login async thunk
interface ILoginPayload {
  email: string
  password: string
}

const initialState: IAuthInitialState = {
  user: {
    _id: "",
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    profileImage: "",
    token: "",
  },
  isLoading: true,
  isError: false,
  error: "",
}
// asyncThunk for signup and login sign in with google
export const signupUser = createAsyncThunk<IAuth, ISignupUserPayload>(
  "auth/signup",
  async (data, thunkAPI) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_DEV_API}/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      )
      const result = await response.json()
      console.log(result)
      return result.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message)
    }
  },
)

export const login = createAsyncThunk<IAuth, ILoginPayload>(
  "auth/login",
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_DEV_API}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        },
      )
      const result = await response.json()
      console.log(result)
      return result.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message)
    }
  },
)

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = {
        _id: "",
        firstName: "",
        lastName: "",
        email: "",
        role: "",
        profileImage: "",
        token: "",
      }
    },
    reset: (state) => {
      state.isLoading = false
      state.isError = false
      state.error = ""
    },
    clearError: (state) => {
      state.isError = false
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signupUser.pending, (state) => {
      state.isLoading = true;

    })
    builder.addCase(signupUser.fulfilled, (state, action: PayloadAction<IAuth>) => {
      state.isLoading = false;
      state.user = action.payload;
    })
    builder.addCase(signupUser.rejected, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.isError = true;
      state.error = action.payload;
    });
    builder.addCase(login.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.error = "";
    })
    builder.addCase(login.fulfilled, (state, action: PayloadAction<IAuth>) => {
      state.isLoading = false;
      state.user = action.payload;
      state.isError = false;
    })
    builder.addCase(login.rejected, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.isError = true;
      state.error = action.payload;
    })
  },
})

export const { logout, clearError, reset } = authSlice.actions

export default authSlice.reducer
