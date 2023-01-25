import { executeQuery } from '../../config/db';
import employeeValidation from '../../common/employeeValidator';
import ErrorHandler from '../../common/errorHandler';
import next from 'next';

const getAllEmployee = async (req, res) => {
    try {
       console.log("all the employees");
       let employeeData = await executeQuery("select * from employees", []);
       res.send(employeeData); 
    } catch (err) {
        res.status(500).json(err);
    }
};

const getEmployeeById = async (req, res) => {
    let id = req.query.id;
    try {
        console.log("employee by id");
        let employeeData = await executeQuery(`select * from employees where emp_id=${id}`, []);
        if(employeeData.length > 0) res.status(200).json(employeeData);
        else{
            next(new ErorrHandler(`no employees found with this id ${id}`, 404));
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const saveEmployee = async (req, res) => {
    try {
        const result = req.body;
        const { 
            emp_name,
            emp_email,
            emp_phone,
            emp_village,
            emp_district,
            emp_city
         } = result;
         
         let { error } = employeeValidation(result);
         if (error) {
            res.status(400).json(error.details[0].message);
         } else {
            console.log("post request");
            let employeeData = await executeQuery(
                "insert into employees(emp_name,emp_email,emp_phone,emp_village,emp_district,emp_city) values(?,?,?,?,?,?)", [emp_name, emp_email, emp_phone, emp_village, emp_district, emp_city]
            );
            employeeData = await executeQuery(
                `select * from employees where emp_id = ${employeeData.inesertId}`
            );
            res.status(201).json(employeeData);
         }
    } catch (err) {
        res.status(400).json(err);
    }
};

const updateEmployee = async (req, res) => {
    let id = req.query.id;
    console.log("id", id);
    const { emp_name, emp_email, emp_phone, emp_village, emp_district, emp_city } = req.body;
    console.log("req body", req.body);
    try {
        let employeeData = await executeQuery("select * from employees where emp_id=?", [id]
        );
        if (employeeData.length > 0) {
            console.log("put request", employeeData);
            employeeData = await executeQuery(
                `update employee set emp_name=?, emp_email=?, emp_phone=?, emp_village=?, emp_district=?, emp_city=? where emp_id=${id}`, [emp_name, emp_email, emp_phone, emp_village, emp_district, emp_city]
            );
            res.status(200).json(employeeData);
        } else {
            res.status(404).json(`employee not found on this id=${id}`);
        }
    } catch (err) {
        res.status(400).json(err);
    }
};

const deleteEmployeeById = async (req, res) => {
    let id = req.query.id;
    try {
        let employeeData = await executeQuery(
            `delete from employees where emp_id=?`, [id]
        );
        res.status(200).json("Employee Deleted Successfully");
    } catch (err) {
        res.status(500).json(err);
    }
};

export {
    getAllEmployee,
    getEmployeeById,
    saveEmployee,
    updateEmployee,
    deleteEmployeeById,
};