import Favorite from "../models/favorite.js";
import Listing from "../models/listing.js";

const addFavorite = async (req, res) => {

    try {

        const { listingId } = req.body;

        const listing = await Listing.findById(listingId);

        if (!listing) {
            return res.status(404).send("Listing not found");
        }

        if (listing.status === "swapped") {
            return res.status(400).send(
                "Cannot favorite a swapped listing"
            );
        }

        const existingFavorite = await Favorite.findOne({
            user: req.user.userId,
            listing: listingId
        });

        if (existingFavorite) {
            return res.status(400).send(
                "Listing already in favorites"
            );
        }

        const favorite = new Favorite({

            user: req.user.userId,
            listing: listingId

        });

        await favorite.save();

        res.send("Listing added to favorites");

    } catch (error) {

        console.log(error);

        res.status(500).send("Server error");

    }

};


const getMyFavorites = async (req, res) => {

    try {

        const favorites = await Favorite.find({
            user: req.user.userId
        })
        .populate("listing")
        .populate("user", "-password");

        res.json(favorites);

    } catch (error) {

        console.log(error);

        res.status(500).send("Server error");

    }

};


const removeFavorite = async (req, res) => {

    try {

        const favorite = await Favorite.findOne({
            _id: req.params.id,
            user: req.user.userId
        });

        if (!favorite) {
            return res.status(404).send("Favorite not found");
        }

        await Favorite.findByIdAndDelete(req.params.id);

        res.send("Favorite removed successfully");

    } catch (error) {

        console.log(error);

        res.status(500).send("Server error");

    }

};


export {
    addFavorite,
    getMyFavorites,
    removeFavorite
};