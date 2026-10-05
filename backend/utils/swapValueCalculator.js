import SwapValueSetting from "../models/swapValueSetting.js";


const calculateSwapValue = async ({
    category,
    brand,
    condition
}) => {

    // Get category setting
    const categorySetting =
        await SwapValueSetting.findOne({
            type: "category",
            name: category,
            isActive: true
        });


    // Get brand setting
    const brandSetting =
        await SwapValueSetting.findOne({
            type: "brand",
            name: brand,
            isActive: true
        });


    // Get condition setting
    const conditionSetting =
        await SwapValueSetting.findOne({
            type: "condition",
            name: condition,
            isActive: true
        });


    // Get Other category as fallback
    const otherCategory =
        await SwapValueSetting.findOne({
            type: "category",
            name: "Other",
            isActive: true
        });


    // Get Other brand as fallback
    const otherBrand =
        await SwapValueSetting.findOne({
            type: "brand",
            name: "Other",
            isActive: true
        });


    // Get Fair condition as fallback
    const fairCondition =
        await SwapValueSetting.findOne({
            type: "condition",
            name: "Fair",
            isActive: true
        });


    // Category value
    const categoryValue =
        categorySetting
            ? categorySetting.value
            : otherCategory
                ? otherCategory.value
                : 30;


    // Brand multiplier
    const brandMultiplier =
        brandSetting
            ? brandSetting.value
            : otherBrand
                ? otherBrand.value
                : 1.0;


    // Condition multiplier
    const conditionMultiplier =
        conditionSetting
            ? conditionSetting.value
            : fairCondition
                ? fairCondition.value
                : 0.5;


    // Calculate final swap value
    const estimatedValue =
        categoryValue *
        brandMultiplier *
        conditionMultiplier;


    // Return rounded value
    return Math.round(estimatedValue);

};


// IMPORTANT:
// This allows listingController.js to use:
// import calculateSwapValue from "...";

export default calculateSwapValue;