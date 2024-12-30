import AttractionImage from "./attraction-image.interface";

export default interface RecommendAttraction {
    attractionId: number;
    recommendId: number;
    attractionName: string;
    attractionAddress: string;
    attractionContent: string;
    images: AttractionImage[];
}