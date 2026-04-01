import { create } from 'zustand';

export const useColorFilterStore = create((set) => ({
    selectedColors: [],
    toggleColor: (color) =>
        set((state) => {
            const exists = state.selectedColors.find((c) => c.name === color.name);
            if (exists) {
                return {
                    selectedColors: state.selectedColors.filter((c) => c.name !== color.name),
                };
            } else {
                return { selectedColors: [...state.selectedColors, color] };
            }
        }),
    clearColors: (color) =>
        set((state) =>
            color
                ? {
                      selectedColors: state.selectedColors.filter((c) => c.name !== color.name),
                  }
                : { selectedColors: [] },
        ),
}));
