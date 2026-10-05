import SwapValueSetting from "../models/swapValueSetting.js";


// GET ALL SETTINGS
const getSwapValueSettings = async (req, res) => {

    try {

        const settings = await SwapValueSetting.find()
            .sort({ type: 1, name: 1 });

        res.json(settings);

    } catch (error) {

        console.log(error);

        res.status(500).send(
            "Unable to get swap value settings"
        );

    }

};


// CREATE SETTING
const createSwapValueSetting = async (req, res) => {

    try {

        const {
            type,
            name,
            value
        } = req.body;


        // Validate type
        const allowedTypes = [
            "category",
            "brand",
            "condition"
        ];


        if (!allowedTypes.includes(type)) {

            return res.status(400).send(
                "Invalid setting type"
            );

        }


        // Check duplicate
        const existingSetting =
            await SwapValueSetting.findOne({
                type,
                name
            });


        if (existingSetting) {

            return res.status(400).send(
                "This setting already exists"
            );

        }


        const setting =
            new SwapValueSetting({

                type,
                name,
                value

            });


        await setting.save();


        res.status(201).json(setting);


    } catch (error) {

        console.log(error);

        res.status(500).send(
            "Unable to create setting"
        );

    }

};


// UPDATE SETTING
const updateSwapValueSetting = async (req, res) => {

    try {

        const setting =
            await SwapValueSetting.findById(
                req.params.id
            );


        if (!setting) {

            return res.status(404).send(
                "Setting not found"
            );

        }


        const {
            name,
            value,
            isActive
        } = req.body;


        if (name !== undefined) {

            setting.name = name;

        }


        if (value !== undefined) {

            setting.value = value;

        }


        if (isActive !== undefined) {

            setting.isActive = isActive;

        }


        await setting.save();


        res.json(setting);


    } catch (error) {

        console.log(error);

        res.status(500).send(
            "Unable to update setting"
        );

    }

};


// DELETE SETTING
const deleteSwapValueSetting = async (req, res) => {

    try {

        const setting =
            await SwapValueSetting.findById(
                req.params.id
            );


        if (!setting) {

            return res.status(404).send(
                "Setting not found"
            );

        }


        await setting.deleteOne();


        res.send(
            "Setting deleted successfully"
        );


    } catch (error) {

        console.log(error);

        res.status(500).send(
            "Unable to delete setting"
        );

    }

};


export {
    getSwapValueSettings,
    createSwapValueSetting,
    updateSwapValueSetting,
    deleteSwapValueSetting
};