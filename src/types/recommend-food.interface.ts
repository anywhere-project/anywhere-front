import FoodImage from "./food-image.interface";

export default interface RecommendFood {
    foodId: number;
    recommendId: number;
    foodName: string;
    foodContent: string;
    images: FoodImage[];
    likeList: string[];
}