// src/controllers/admin/admin_exam_category.controller.js
const adminExamCategoryService = require('../../services/admin/admin_exam_category.service');

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await adminExamCategoryService.getAllCategories();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCategoryById = async (req, res) => {
    try {
      const categoryId = req.params.id;
      const category = await adminExamCategoryService.getCategoryById(categoryId);
      res.status(200).json(category);
    } catch (error) {
      res.status(404).json({ message: error.message }); // 404 Not Found nếu không tìm thấy
    }
}

exports.createCategory = async (req, res) => {
    try {
        const categoryData = req.body;
        const newCategory = await adminExamCategoryService.createCategory(categoryData);
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
    const categoryData = req.body;
    const updatedCategory = await adminExamCategoryService.updateCategory(categoryId, categoryData);
    res.status(200).json(updatedCategory);
    } catch(error) {
        res.status(500).json({message: error.message});
    }
}

exports.deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        await adminExamCategoryService.deleteCategory(categoryId);
        res.status(204).json({message: "Category deleted successfully"});
    } catch(error){
        res.status(500).json({message: error.message});
    }
}