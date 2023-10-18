// useTeams.ts
import { useEffect, useState } from "react";
import { db } from "../../config/firebase"; // Replace with your actual path
import { collection, getDocs } from 'firebase/firestore';

const useTeams = () => {

    const [loading, setLoading] = useState(true);
    const [teams, setTeams] = useState<{ [id: string]: any }>({});
    
    useEffect(() => {
      const fetchTeams = async () => {
        const teamsCollection = collection(db, "teams");
        const teamsSnapshot = await getDocs(teamsCollection);
        let teamsData: { [id: string]: any } = {};
        teamsSnapshot.forEach(doc => {
          teamsData[doc.id] = doc.data();
        });
        setTeams(teamsData);
        setLoading(false);
      };
    
      fetchTeams();
    }, []);
    
    return { teams, loading };    
};

export default useTeams;
