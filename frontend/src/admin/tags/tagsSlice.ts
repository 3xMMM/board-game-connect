import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Tag } from '../../spa';
import { RootState } from '../../services/store';

interface TagsState {
    value: Tag[]
}

const initialState: TagsState = {
    value: [],
};

export const tagsSlice = createSlice({
    name: 'tags',
    initialState,
    reducers: {
        setTags: (state, action: PayloadAction<Tag[]>) => {
            state.value = action.payload;
        },
    },
});

export const { setTags } = tagsSlice.actions;

export const selectTags = (state: RootState) => state.tags.value;

export default tagsSlice.reducer;