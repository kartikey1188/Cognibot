import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axiosClient";

// login user action
export const loginUser = createAsyncThunk("loginUser", async (data, {rejectWithValue}) => { 
        try {
            const response = await axiosInstance.post('/login', data);
            return response.data;
        } catch (error) {
            console.clear()
            return rejectWithValue(error.response.data.message);
        }
}); 

// logout user action
export const logoutUser = createAsyncThunk("logoutUser", async () => {
    const response = await axiosInstance.get('/logout');
    return;
})

export const fetchUser = createAsyncThunk("fetchUser", async ()=>{
    try{
        const response = await axiosInstance.get("/user")
        return response.data
    }catch(error){
        return rejectWithValue(error.response.data.message);
    }
})

const authSlice = createSlice({ 
    name: 'auth',
    initialState: {
        user: null,
        loading: false,
        error: ""
    },

    reducers: {
        setError: (state, action) => {
          state.error = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loginUser.pending, (state, action) => {
            state.loading = true;
        })
        builder.addCase(loginUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.error = "";
        })
        builder.addCase(loginUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload

        })
        builder.addCase(logoutUser.pending, (state, action) => {
            state.loading = true;
        })
        builder.addCase(logoutUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = null;
        })
        builder.addCase(logoutUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        builder.addCase(fetchUser.pending, (state, action)=>{
            state.loading = true;
        })
        builder.addCase(fetchUser.fulfilled, (state, action)=>{
            state.loading = false;
            state.user = action.payload;
            state.error = ""
        })
        builder.addCase(fetchUser.rejected, (state, action)=>{
            state.loading = false;
            state.error = action.payload
            state.user = null
        })
        // should add more cases for other actions
    }

})

export default authSlice.reducer;
export const { setError } = authSlice.actions;