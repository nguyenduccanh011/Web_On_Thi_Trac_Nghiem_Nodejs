const examCategoryService = require('../services/exam_category.service');

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await examCategoryService.getAllCategories();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCategoryById = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await examCategoryService.getCategoryById(categoryId);
        res.json(category);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

exports.createCategory = async (req, res) => {
    try {
        const categoryData = req.body;
        const newCategory = await examCategoryService.createCategory(categoryData);
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const categoryData = req.body;
        const updatedCategory = await examCategoryService.updateCategory(categoryId, categoryData);
        res.json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        await examCategoryService.deleteCategory(categoryId);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};