import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";
import fs from 'fs'
export const createCategoryController=async(req,res)=>{
    try {
        const {name}=req.fields
        const {photo} =req.files
        if(!name){
            return res.status(401).send({
                message:'Name is required'
            })
        }
        if(!photo){
            return res.status(401).send({
                message:'Photo is required'
        })
        }
        const existingCategory=await categoryModel.findOne({name})
        if(existingCategory){
            return res.status(200).send({
                success:true,
                message:"Category already exists"
            })
        }
        const category=await new categoryModel({name,slug:slugify(name)})
        if(photo){
            category.photo.data =fs.readFileSync(photo.path)
            category.photo.contentType =photo.type
        }await category.save()
        res.status(201).send({
            success:true,
            message:'New category Created',
            category
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'Error in Category'
        })
    }
};

export const updateCategoryController=async(req,res)=>{
    try {
        const {name}=req.fields
        const {photo} =req.files
        const category=await categoryModel.findByIdAndUpdate(req.params.pid,{
            ...req.fields,slug:slugify(name)},{new:true})
        if(photo){
            category.photo.contentType =photo.type
            category.photo.data =fs.readFileSync(photo.path)
            
        }
        await category.save()
        res.status(201).send({
            success:true,
            message:'Category updated successfully',
            category
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error while updating',
            error
        })
    }
}
export const categoryController=async(req,res)=>{
    try {
        const category=await categoryModel.find({}).select('-photo')
        res.status(200).send({
            success:true,
            message:"All categories list",
            category
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error while getting Categories',
            error
        })
    }
}
export const singleCategoryController=async(req,res)=>{
    try {
        const category=await categoryModel.findOne({_id:req.params.pid}).select('-photo')
        res.status(200).send({
            success:true,
            message:'Get Single category success',
            category
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error while getting single category',
            error
        })
    }
}
export const singleCategoryPhotoController=async(req,res)=>{
    try {
        const category=await categoryModel.findById(req.params.pid).select('photo')
        if(category.photo.data){
            res.set('content-type',category.photo.contentType)
            return res.status(200).send(category.photo.data)
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'error while getting photo',
            error
        })
    }
}
export const deleteCategoryController=async(req,res)=>{
    try {
        const {id} =req.params
        await categoryModel.findByIdAndDelete(id).select("-photo")
        res.status(200).send({
            success:true,
            message:'Category deleted successfully'
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'error while deleting category',
            error
        })
    }
}
