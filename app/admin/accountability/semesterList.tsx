import { useEffect, useState } from "react";

interface SemesterForm {
    id: string;
    semester: string;
    link: string;
}

const SemesterList = () => {
    const [semesters, setSemesters] = useState<SemesterForm[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSemesterList = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/semester/list`);

                if (!response.ok) {
                    throw new Error("Failed to fetch semester list");
                }

                const data = await response.json();
                setSemesters(data);
            } catch (error) {
                console.error("Error fetching semester list:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSemesterList();
    }, []);



    return  (semesters) ;
};

export default SemesterList;
