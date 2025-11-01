import {Subject} from "../types/subject";

const API_URL = "http://localhost:3000/subjects";

export const subjectService = {
    async getAll() : Promise<Subject[]>{
        try{
            console.log("Fetching subjects from:", API_URL);
            const rest = await fetch(API_URL, {
                cache: "no-store",
                method: "GET",
                headers:{
                    "Content-Type": "application/json",
                }
            });
            console.log("Response status:", rest.status);
            if(!rest.ok){
                const errorText = await rest.text();
                console.error("API Error:", errorText);
                throw new Error(`Failed to fetch subjects: ${rest.status} ${rest.statusText}`);
            }

            const data = await rest.json();
            console.log("Subjects fetched successfully:", data.length, "subjects");
            return data;
        }catch(error){
            console.error("Fetch error:", error);
            throw error;
        }
    },


    async create(data: Subject): Promise<Subject> {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data),

        });
        if(!res.ok) throw new Error("Failed to create subject");
        return res.json();
    },

    async update(id: string, data: Subject): Promise<Subject>{
        const res = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data),
        });
        if(!res.ok) throw new Error("Failed to update subject");
        return res.json();
    },

    async delete(id: string): Promise<void>{
        const res = await fetch(`${API_URL}/${id}`, {method: "DELETE"});
        if(!res.ok) throw new Error("Failed to delete subject");
    },
};