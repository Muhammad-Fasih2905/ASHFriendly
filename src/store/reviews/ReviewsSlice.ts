import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RatingStats {
    count: number;
    percentage: number;
}

interface RatingStatsSummary {
    excellent: RatingStats;
    good: RatingStats;
    average: RatingStats;
    below_average: RatingStats;
    poor: RatingStats;
}

interface User {
    id: number;
    name: string;
    profile_image: string;
}

interface Review {
    id: number;
    rating: number;
    comment: string;
    images: string[];
    created_at: string;
    user: User;
}

interface Establishment {
    id: number;
    name: string;
    main_image: string;
    average_rating: number;
    total_reviews: number;
    rating_stats: RatingStatsSummary;
}

interface ReviewsData {
    data: Review[];
    meta: {
        current_page: number;
        last_page: number;
        total: number;
    };
}

interface EstablishmentState {
    establishment: Establishment | null;
    reviews: ReviewsData | null;
    isLoading: boolean;
}

const initialState: EstablishmentState = {
    establishment: null,
    reviews: null,
    isLoading: false,
};


const reviewSlice = createSlice({
    name: 'reviewSlice',
    initialState,
    reducers: {
        setEstablishment(state, action: PayloadAction<Establishment>) {
            state.establishment = action.payload;
        },
        setReviews(state, action: PayloadAction<ReviewsData>) {
            state.reviews = action.payload;
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload;
        },
    },
});

export const { setEstablishment, setReviews, setLoading } = reviewSlice.actions;

export default reviewSlice.reducer;