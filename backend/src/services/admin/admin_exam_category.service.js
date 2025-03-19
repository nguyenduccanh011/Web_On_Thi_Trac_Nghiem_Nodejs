const ExamCategory = require('../../models/exam_category.model');

exports.getAllCategories = async () => {
    try {
        const categories = await ExamCategory.findAll();
        return categories;
    } catch (error) {
        throw error;
    }
};

exports.getCategoryById = async (categoryId) => {
    try {
        const category = await ExamCategory.findByPk(categoryId);
        if (!category) {
            throw new Error('Category not found');
        }
        return category;
    } catch (error) {
        throw error;
    }
};

exports.createCategory = async (categoryData) => {
    try {
        const newCategory = await ExamCategory.create(categoryData);
        return newCategory;
    } catch (error) {
        throw error;
    }
};

exports.updateCategory = async (categoryId, categoryData) => {
    try {
        const category = await ExamCategory.findByPk(categoryId);
        if (!category) {
            throw new Error('Category not found');
        }
        await category.update(categoryData);
        return category;
    } catch (error) {
        throw error;
    }
};

exports.deleteCategory = async (categoryId) => {
    try {
        const category = await ExamCategory.findByPk(categoryId);
        if (!category) {
            throw new Error('Category not found');
        }
        await category.destroy();
        return { message: 'Category deleted successfully' };
    } catch (error) {
        throw error;
    }
};
