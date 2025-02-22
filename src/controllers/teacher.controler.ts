import { Request, Response } from "express";
import { AppDataSource } from "../config";
import { Teacher } from "../entity/teacher.entity";


export const createTeacher = async (req: Request, res:Response) => {
    const teacherRepo = AppDataSource.getRepository(Teacher);

    const {first_name, last_name, email, phone } = req.body;
    if(!first_name || !last_name || !email || !phone){
        return res.status(400).json({ messsage: "All field are requried"});
    }
    try{
        const teacher = new Teacher();
        teacher.first_name = first_name,
        teacher.last_name = last_name,
        teacher.email = email,
        teacher.phone = phone

        await teacherRepo.save(teacher);
        return res.status(201).json({ message: "Teacher created successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const getTeacher = async (req: Request, res: Response) =>{
    const teacherRepo = AppDataSource.getRepository(Teacher);
    
    
    try {
        const teacher = await teacherRepo.find();

        return res.status(200).json({ message: "Student get successfully", teacher });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    } 
};