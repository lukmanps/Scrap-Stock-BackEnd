import { pickupCollection } from "../../model/pickupModel";
import { scrapCollection } from "../../model/scrapModel";
import { userCollection } from "../../model/userModel";

export const getCustomerCount = async () => {
    try {
        const count = await userCollection.countDocuments({});
        return count
    }
    catch (err) {
        console.log(err, " :: Error in getCustomerCount")
    }
}

export const getPickupCount = async () => {
    try {
        const count = await pickupCollection.countDocuments({});
        return count
    }
    catch (err) {
        console.log(err, " :: Error in getPickupCount");
    }
}

export const getDashboardInfo = async () => {
    try {
        const pickupCount = await pickupCollection.countDocuments({});
        const customerCount = await userCollection.countDocuments({});
        const totalAmountPaid = await userCollection.aggregate([
            {
                $group: {
                    _id: null,
                    totalAmountPaid: { $sum: '$wallet' }
                }
            }
        ])
        
        const scrapQty = await scrapCollection.aggregate([
            {
                $group: {
                    _id: '$category',
                    totalQty: { $sum: '$totalQty' }
                }
            }
        ]);

        const totalPaid = totalAmountPaid.map((item) => item.totalAmountPaid)[0];


        return { pickupCount, customerCount, scrapQty, totalPaid }
    }
    catch (err) {
        console.log(err, ":: Error in getDashboardInfo");
    }
}

export default {
    getCustomerCount,
    getPickupCount
}