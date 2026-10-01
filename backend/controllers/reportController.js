import Report from "../models/report.js";

const createReport = async (req, res) => {

    const { listing, reportedUser, reason } = req.body;

     const report = new Report({
        reporter: req.user.userId,
        listing,
        reportedUser,
        reason
    });

    await report.save();

    res.json(report);
};



const getReports = async (req, res) => {

    const reports = await Report.find()
        .populate("reporter", "-password")
        .populate("listing")
        .populate("reportedUser", "-password");

    res.json(reports);
};



const updateReport = async (req, res) => {

    const { status } = req.body;

    const allowedStatuses = [
        "pending",
        "reviewed",
        "resolved"
    ];

    if (!allowedStatuses.includes(status)) {
        return res.status(400).send("Invalid report status");
    }

    const report = await Report.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
    );

    if (!report) {
        return res.status(404).send("Report not found");
    }

    res.json(report);
};



export {
    createReport,
    getReports,
    updateReport
};
