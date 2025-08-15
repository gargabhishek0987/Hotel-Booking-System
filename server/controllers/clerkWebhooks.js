import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebHooks = async (req, res) => {
    // create a svix webhook instance 
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        const headers = {

            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        
            
        };

        // verify headers
        await whook.verify(JSON.stringify(req.body), headers);

        // getting data from the request body

        const { data, type } = req.body;
        const userData = {
            _id: data.id,
            email: data.email_addresses[0].email_address,
            userName: data.first_name + " " + data.last_name,  
            image: data.profile_image_url ,
            
            recentSearchCities: [], // initialize with an empty array
            
        }
        //switch case to handle different webhook events
        switch (type) {
            case "user.created": {
                await User.create(userData);
                break;

            }
            case "user.updated": {
                await User.findByIdAndUpdate(data.id, userData);
                break;
            }
            case "user.deleted": {
                await User.findByIdAndDelete(data.id);
                break;
            }
            default:
                break;
        }
        res.json({success:true, message: "Webhook processed successfully"});

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: "Webhook processing failed" });
        
    }
}
export default clerkWebHooks;