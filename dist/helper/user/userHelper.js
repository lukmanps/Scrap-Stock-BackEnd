"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.doUpdateUserDetails = exports.doUpdateProfilePicture = exports.getRecentPickups = exports.getAllReviews = exports.addReview = exports.doSellScrap = void 0;
const pickupModel_1 = require("../../model/pickupModel");
const reviewModel_1 = require("../../model/reviewModel");
const scrapModel_1 = require("../../model/scrapModel");
const userModel_1 = require("../../model/userModel");
const doSellScrap = (data) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        let totalAmount = 0;
        for (const scrap of data.scrap) {
            const scrapData = yield scrapModel_1.scrapCollection.findById(scrap.item);
            if (scrapData) {
                totalAmount += scrapData.price * scrap.quantity;
            }
            else {
                reject({ error: 'Scrap item not found', status: false });
                return; // Return to exit the loop early if a scrap item is not found
            }
        }
        const newData = Object.assign(Object.assign({}, data), { totalAmount });
        pickupModel_1.pickupCollection.create(newData)
            .then((response) => {
            response.scrap.map((item) => __awaiter(void 0, void 0, void 0, function* () {
                var _a, _b;
                const scrap = yield scrapModel_1.scrapCollection.findById(item.item);
                if (scrap) {
                    let qty = (_a = scrap === null || scrap === void 0 ? void 0 : scrap.totalQty) !== null && _a !== void 0 ? _a : 0;
                    let quantity = (_b = item.quantity) !== null && _b !== void 0 ? _b : 0;
                    qty += quantity;
                    yield scrapModel_1.scrapCollection.updateOne({ _id: item.item }, { $set: { totalQty: qty } });
                }
            }));
            resolve({ response, status: true });
        })
            .catch((err) => {
            reject({ err, status: false });
            console.log(err, " : ERROR in DB");
        });
    }));
};
exports.doSellScrap = doSellScrap;
const addReview = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(data, " ::DATA in addReview");
        const response = yield reviewModel_1.reviewCollection.create(data);
        console.log(response, " :: Resposnse from database");
        return { response, status: true };
    }
    catch (err) {
        console.log(" :: ERROR in addReview", err);
        return { err, status: false };
    }
    // return new Promise((resolve, reject) => {
    //         reviewCollection.create(data)
    //         .then((response) => {
    //             resolve({response, status: true})
    //         })
    //         .catch((err) => {
    //             reject({err, status: false});
    //             console.log(err, " :: ERROR in addReview");
    //         })
    // })
});
exports.addReview = addReview;
const getAllReviews = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reviews = yield reviewModel_1.reviewCollection.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $sort: { _id: -1 }
            },
            {
                $limit: 5
            },
            {
                $project: {
                    '_id': 1,
                    'review': 1,
                    'value': 1,
                    'user.username': 1
                }
            },
        ]).exec();
        return reviews;
    }
    catch (err) {
        console.log(err, " ::ERROR in getAllReviews");
    }
});
exports.getAllReviews = getAllReviews;
const getRecentPickups = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pickups = yield pickupModel_1.pickupCollection.find({ user: userId });
        return pickups;
    }
    catch (err) {
        console.log(err, ' :: Error in getRecentPickups');
    }
});
exports.getRecentPickups = getRecentPickups;
const doUpdateProfilePicture = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(data, "datain do update");
        const updatedUser = yield userModel_1.userCollection.findByIdAndUpdate(data.id, { profilePicture: data.dp }, { new: true } // Add this option to return the updated document
        );
        console.log(updatedUser, ":: Updated profile picture");
        return updatedUser;
    }
    catch (err) {
        console.log(err, " : error in doUpdateProfilePicture");
        return { status: false };
    }
});
exports.doUpdateProfilePicture = doUpdateProfilePicture;
const doUpdateUserDetails = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedUser = yield userModel_1.userCollection.findOneAndUpdate({ _id: data.id }, // Filter criteria
        { $set: { username: data.username, phoneNo: data.phoneNo } }, // Update object with $set operator
        { new: true } // Option to return the updated document
        );
        return updatedUser;
    }
    catch (err) {
        console.log(err, ":: Error in doUpdateUserDetails");
        return { status: false };
    }
});
exports.doUpdateUserDetails = doUpdateUserDetails;
exports.default = {
    doSellScrap: exports.doSellScrap,
    addReview: exports.addReview,
    getRecentPickups: exports.getRecentPickups,
    doUpdateProfilePicture: exports.doUpdateProfilePicture
};
