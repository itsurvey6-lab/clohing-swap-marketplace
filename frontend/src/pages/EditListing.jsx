import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";


function EditListing() {

    const { id } = useParams();

    const [listing, setListing] = useState(null);

    useEffect(() => {

    api.get(`/listings/${id}`)
      .then((response) => {

        console.log(response.data);

        setListing(response.data);
      });

  }, [id]);


  const handleUpdate = async () => {

    try {

        const response = await api.put(
        `/listings/${id}`,
        listing
        );

        console.log(response.data);

        alert("Listing updated successfully");

    } catch (error) {

        console.log(error);

        alert(error.response?.data || "Update failed");

    }

    };

  return (
    <div>

      <h1>Edit Listing</h1>

      <p>Listing ID: {id}</p>

      <input
        type="text"
        value={listing?.title || ""}
        onChange={(e) =>
            setListing({
            ...listing,
            title: e.target.value
            })
        }
        />

        <input
        type="text"
        value={listing?.category || ""}
        onChange={(e) =>
            setListing({
            ...listing,
            category: e.target.value
            })
        }
        />

        <input
        type="text"
        value={listing?.brand || ""}
        onChange={(e) =>
            setListing({
            ...listing,
            brand: e.target.value
            })
        }
        />

        <input
        type="text"
        value={listing?.size || ""}
        onChange={(e) =>
            setListing({
            ...listing,
            size: e.target.value
            })
        }
        />

        <input
        type="text"
        value={listing?.condition || ""}
        onChange={(e) =>
            setListing({
            ...listing,
            condition: e.target.value
            })
        }
        />

        <input
        type="number"
        value={listing?.swapValue || ""}
        onChange={(e) =>
            setListing({
            ...listing,
            swapValue: e.target.value
            })
        }
        />

        <input
        type="text"
        value={listing?.location || ""}
        onChange={(e) =>
            setListing({
            ...listing,
            location: e.target.value
            })
        }
        />

        <button onClick={handleUpdate}>
            Update Listing
        </button>

    </div>

        

  );
}

export default EditListing;