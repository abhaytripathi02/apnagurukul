const Category = require("../models/Category"); // ->> Tag is replaced by Category
const Course = require("../models/Course");

//create Category Handler function
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    //validation
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    //create entry in db
    const newCategory = await Category.create({
      name: name,
      description: description
    });

    console.log(newCategory);

    return res.status(200).json({
      success: true,
      message: "Category Created Successfully"
    });
  } catch (error) {
    console.log("Error occur while creating Categorys:", error);
    return res.status(500).json({
      success: false,
      message: `Error occurs while creating Categorys: ${error.message}`
    });
  }
};


// getAll Categorys 
exports.showAllCategories = async (req, res, next) => {
  try {
    const AllCategorys = await Category.find({}, { name: true, description: true });
    // const AllCategorys = await Category.find();

    if (!AllCategorys) {
      return res.json({
        success: false,
        message: `Categorys not found`
      });
    }

    res.status(200).json({
      success: true,
      Categorys: AllCategorys,
      message: `All Categorys found successfully`
    });

  } catch (error) {
    console.log("Error Occurs while getting all Categorys : ", error);
    return res.status(500).json({
      success: false,
      message: `Error occured while getting all Categorys: ${error.message}`
    });
  }
};


//categoryPageDetails
exports.CategoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.body;

    // Get courses for the specified category
    const selectedCategory = await Category.findById(categoryId)
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: "ratingAndReviews"
      })
      .exec();

    console.log("SELECTED COURSE", selectedCategory);
    // Handle the case when the category is not found
    if (!selectedCategory) {
      console.log("Category not found.");
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    // Handle the case when there are no courses
    if (selectedCategory.courses.length === 0) {
      // <--- May be error occur
      console.log("No courses found for the selected category.");
      return res.status(404).json({
        success: false,
        message: "No courses found for the selected category."
      });
    }

    // Get courses for other categories
    const categoriesExceptSelected = await Category.find({
      _id: { $ne: categoryId } //-> $ne - not equal
    });

    let differentCategory = await Category.findOne(
      categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
        ._id
    )
      .populate({
        path: "courses",
        match: { status: "Published" }
      })
      .exec();

    // Get top-3-selling courses across all categories
    const allCategories = await Category.find()
      .populate({
        path: "courses",
        match: { status: "Published" }
      })
      .exec();
    // Think Logic  -> If a course from other category has more buy
    const allCourses = allCategories.flatMap(category => category.courses);
    const mostSellingCourses = allCourses
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10);

    return res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategory,
        mostSellingCourses
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// update Category handler function
