import User from "../models/user.js";

const getUsers = async (req, res) => {

    const user = await User.find();
    res.json(user);

};


const getUser = async (req, res) => {

    const user = await User.findById(req.params.id);
    res.json(user);
};


const updateUser = async (req, res) => {

    const user = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new:true }
    );

    res.json(user)
};


const deleteUser = async (req, res) => {

    await User.findByIdAndDelete(req.params.id);
    res.send("user deleted successfully");
}

const getMyProfile = async (req, res) => {

    try {

        const user = await User.findById(req.user.userId)
            .select("-password");

        if (!user) {
            return res.status(404).send("User not found");
        }

        res.json(user);

    } catch (error) {

        console.log(error);

        res.status(500).send("Server error");

    }

};

export { 

    getUsers,
    getUser,
    updateUser,
    deleteUser,
    getMyProfile

 };
