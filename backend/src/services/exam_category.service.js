const ExamCategory = require('../models/exam_category.model');

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
      const existingCategory = await ExamCategory.findOne({
        where: { category_name: categoryData.category_name },
      });
  
      if (existingCategory) {
        throw new Error('Category name already exists');
      }
  
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

        // Kiểm tra xem có exam hoặc question nào thuộc category này không
        const exams = await category.getExams(); // Giả sử bạn đã định nghĩa quan hệ này
        const questions = await category.getQuestions();

        if (exams.length > 0 || questions.length > 0) {
            throw new Error('Cannot delete category because it has associated exams or questions');
        }


        await category.destroy();
        return { message: 'Category deleted successfully' };
    } catch (error) {
        throw error;
    }
};