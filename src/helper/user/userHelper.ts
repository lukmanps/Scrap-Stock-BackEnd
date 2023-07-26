import { selectedData } from "../../controllers/user/userController"
import { pickupCollection } from "../../model/pickupModel"

export const doSellScrap = (data: selectedData) => {
    return new Promise((resolve, reject) => {
        const date = new Date();
        
        pickupCollection.create(data)
        .then((response) => {
            console.log(response, " : Response after adding data");
        })
        .catch((err) => {
            console.log(err, " : ERROR In doSellScrap");
        })
    })
}

export default {
    doSellScrap
}