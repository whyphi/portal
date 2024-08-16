"use client"
import React, { useState, useEffect } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import Loader from "@/components/Loader";
import { Label, Select } from "flowbite-react";
import { Canvas } from 'reaflow';



export default function FamilyTree() {
  const { token } = useAuth();
  const [familyTreeData, setFamilyTreeData] = useState<any>({});
  const [currentFamily, setCurrentFamilly] = useState<string>("");
  const [currentFamilyData, setCurrentFamillyData] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const textStyles = {
    title: "text-2xl font-medium dark:text-white mb-6 mt-4 ",
    subtitle: "mb-4 text-lg font-normal text-gray-500 dark:text-gray-400",
  };

  const generateFamilyTreeNodesAndEdges = (data: any) => {
    let nodesSet = new Set();
    let edges = [];

    for (const member of data) {
      const big = member.big
      const id = member.name

      if (!nodesSet.has(big)) {
        nodesSet.add(big);
      }
      if (!nodesSet.has(id)) {
        nodesSet.add(id);
      }
      if (big !== id) {
        edges.push({
          id: `${big}-${id}`,
          from: big,
          to: id
        });
      }
    }

    const nodes = Array.from(nodesSet).map((node) => {
      return {
        id: node,
        text: node
      };
    });


    return {
      nodes: nodes,
      edges: edges
    }
  }


  const fetchData = () => {
    setIsLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/members/family-tree`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setFamilyTreeData(data);
        setCurrentFamilly(Object.keys(data)[0]);
        setCurrentFamillyData(generateFamilyTreeNodesAndEdges(data[Object.keys(data)[0]]));
        setIsLoading(false);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  useEffect(() => {
    fetchData();
  }, []);


  if (isLoading) {
    return <Loader />
  }

  return (
    <div className="overflow-x-auto">
      <h1 className={textStyles.title}>Family Tree</h1>
      <div className="mb-2 block">
        <Label htmlFor="family" value="Select Family" />
      </div>
      <Select id="family" value={currentFamily}>
        {Object.keys(familyTreeData).map((familyKey: string) => (
          <option key={familyKey}>{familyKey}</option>
        ))}
      </Select>
      <div>
        <Canvas
          maxHeight={700}
          maxWidth={850}
          panType="drag"
          readonly={true}
          nodes={currentFamilyData.nodes}
          edges={currentFamilyData.edges}
        />
      </div>
    </div>
  );
}

