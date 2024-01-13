import { useEffect, useState } from "react";

interface SemesterForm {
    id: number;
    name: string;
    link: string;
}

const SemesterList = () => {
    const [semesters, setSemesters] = useState<SemesterForm[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSemesterList = async () => {
            try {
                const response = await fetch(`/semester/list`);

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

    return { semesters };
};

export default SemesterList;
