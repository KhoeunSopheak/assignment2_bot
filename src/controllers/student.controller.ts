import { Request, Response } from "express";
import { Student } from "../entity/student.entity";
import { AppDataSource } from "../config";



export const studentData = async (req: Request, res: Response) => {

    const studentRepo = AppDataSource.getRepository(Student);

    const { first_name, last_name, email, phone, birth_date, gender, address } = req.body;

    if (!first_name || !last_name || !email) {
        return res.status(400).json({
            message: "All fields are required",
        });
    }

    try {
        const student = new Student();
        student.first_name = first_name;
        student.last_name = last_name;
        student.email = email;
        student.phone = phone;
        student.birth_date = birth_date;
        student.gender = gender;
        student.address = address;

        await studentRepo.save(student);

        return res.status(201).json({ message: "Student created successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getStudent = async (req: Request, res: Response) =>{
    const studentRepo = AppDataSource.getRepository(Student);
    
    
    try {
        const student = await studentRepo.find();

        return res.status(200).json({ message: "Student get successfully", student });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    } 
};