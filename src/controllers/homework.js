import Homework from '../models/Homework.js';

export const addHomeworkForm = (req, res) => {
	if (!req.isAuthenticated() || !req.user.admin) return res.redirect("/");
	res.render("addHomework");
};

export const addHomework = async (req, res) => {
	if (!req.isAuthenticated() || !req.user.admin) return res.redirect("/");
	try{
		const hwItems = [];
		req.body.desc = req.body.desc ? [].concat(req.body.desc) : [];
		req.body.required = req.body.required ? [].concat(req.body.required) : [];
		req.body.extra = req.body.extra ? [].concat(req.body.extra) : [];
		for (let i = 0; i < req.body.desc.length; i++) {
			hwItems.push({
				itemIndex: i,
				description: req.body.desc[i],
				required: req.body.required[i] === "true" ? true : false,
				pushWork: req.body.extra[i] === "true" ? true : false,
			});
		}
		const homework = {
			classNo: req.body.number.split(","),
			dueNo: req.body.due,
			items: hwItems
		}
		await Homework.create(homework);
		req.session.flash = { type: "success", message: ['Homework added']};
	} catch (err) {
		console.log(err);
		req.session.flash = { type: "error", message: ['Homework not added']};
	} finally {
		res.redirect("/hw/add");
	}
};