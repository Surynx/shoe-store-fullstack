import Admin from "../../models/admin.model.js"
import STATUS from "../../constants/status.constant.js";

const getDashboardInfo = async (req,res) => {
    
    const admin = await Admin.findOne({});

    res.status(STATUS.SUCCESS.OK).json({ adminEmail:admin.email })
}

export {getDashboardInfo}