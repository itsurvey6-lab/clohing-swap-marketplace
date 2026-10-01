import Listing from "../models/listing.js";


const createListing = async (req, res) => {

    const listing = new Listing({
        ...req.body,
        image: req.file ? req.file.filename : null,
        owner: req.user.userId
});
    await listing.save();
    res.json(listing);

};




const getItems = async (req, res) => {

    const filter = {};

    if (req.query.category) {
        filter.category = req.query.category;
    }

    if (req.query.brand) {
    filter.brand = req.query.brand;
    }
    if (req.query.size) {
    filter.size = req.query.size;
    }

    if (req.query.location) {
        filter.location = req.query.location;
    }

    if (req.query.condition) {
        filter.condition = req.query.condition;
    }

    if (req.query.status) {
    filter.status = req.query.status;
    }

    if (req.query.minValue || req.query.maxValue) {

    filter.swapValue = {};

    if (req.query.minValue) {
        filter.swapValue.$gte = Number(req.query.minValue);
    }

    if (req.query.maxValue) {
        filter.swapValue.$lte = Number(req.query.maxValue);
    }
    }



    let query = Listing.find(filter);

    if (req.query.sort === "low") {
        query = query.sort({ swapValue: 1 });
    }

    if (req.query.sort === "high") {
        query = query.sort({ swapValue: -1 });
    }

    const page = Math.max(Number(req.query.page) || 1, 1);

    const limit = Math.max(Number(req.query.limit) || 5, 1);

    const skip = (page - 1) * limit;

    const total = await Listing.countDocuments(filter);

    const totalPages = Math.ceil(total / limit);

    const items = await query
        .skip(skip)
        .limit(limit);
    
        
    res.json({
        total,
        page,
        limit,
        totalPages,
        items
    });
}




const getItem = async (req, res) => {

    const item = await Listing.findById(req.params.id);
    res.json(item);
}


const updateItem = async (req, res) => {

    const item = await Listing.findById(req.params.id);

    if (!item) {
        return res.status(404).send("Listing not found");
    }

    if (item.owner.toString() !== req.user.userId) {
        return res.status(403).send("You can only update your own listing");
    }

    Object.assign(item, req.body);

    await item.save();

    res.json(item);
}




const deleteItem = async (req, res) => {

    const item = await Listing.findById(req.params.id);

    if (!item) {
        return res.status(404).send("Listing not found");
    }

    if (item.owner.toString() !== req.user.userId) {
        return res.status(403).send("You can only delete your own listing");
    }

    await Listing.findByIdAndDelete(req.params.id);

    res.send("Item Deleted");
}



const getMyListings = async (req, res) => {

    try {

        const listings = await Listing.find({
            owner: req.user.userId
        })

        res.json(listings);
        
    } catch (error) {
        console.log(error);

        res.status(500).send("server error");
    }

}



export { 
    createListing,
    getItems,
    getItem,
    updateItem,
    deleteItem,
    getMyListings
 };
