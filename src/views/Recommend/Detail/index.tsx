import { useParams } from 'react-router-dom';
import './style.css';
import { RecommendAttraction, RecommendFood, RecommendMission } from 'types';

interface Attractions {
    recommendAttraction: RecommendAttraction;
}

interface Foods {
    recommendFood: RecommendFood;
}

interface Missions {
    recommendMission: RecommendMission;
}

export default function RecommendDetail() {

    const { recommendId } = useParams();

    

    return (
        <></>
    );

}