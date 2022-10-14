import mongoose from "mongoose";

import Homework from '../models/Homework.js';
import HomeworkItem from '../models/HomeworkItem.js';
import HomeworkExtra from '../models/HomeworkExtra.js';
import HomeworkProgress from '../models/HomeworkProgress.js';
import User from '../models/User.js';

export const addEditHomeworkForm = async (req, res) => {
	if (!req.isAuthenticated() || !req.user.admin) return res.redirect("/");
	const edit = !!req.params.id;
	let homework = null;
	if (edit) {
		homework = await Homework.findById(req.params.id).lean();
		homework.classNo = homework.classNo.join(',');
	}
	res.render("addHomework", { edit, homework });
};

export const addEditHomework = async (req, res) => {
	if (!req.isAuthenticated() || !req.user.admin) return res.redirect("/");
	try{
		const hwData = {
			classNo: req.body.number.split(","),
			dueNo: req.body.due,
			submit: req.body.submit,
			cohort: req.body.cohort,
			note: req.body.note
		}
		const homework = await Homework.findByIdAndUpdate(req.params.id  || mongoose.Types.ObjectId(), hwData, {upsert: true, new: true});
		const hwDesc = req.body.hwDesc ? [].concat(req.body.hwDesc) : [];
		const hwClass = req.body.hwClass ? [].concat(req.body.hwClass) : [];
		const hwDue = req.body.hwDue ? [].concat(req.body.hwDue) : [];
		const hwRequired = req.body.required ? [].concat(req.body.required) : [];
		const pwDesc = req.body.pwDesc ? [].concat(req.body.pwDesc) : [];
		for (let i = 0; i < hwDesc.length; i++) {
			const item = new HomeworkItem({
				homework: homework._id,
				itemIndex: i + 1,
				class: hwClass[i],
				due: hwDue[i],
				description: hwDesc[i],
				required: hwRequired[i] === "true" ? true : false,
			});
			await item.save();
		}
		if (pwDesc.length) {
			for (let i = 0; i < pwDesc.length; i++) {
				const extra = new HomeworkExtra({
					homework: homework._id,
					extraIndex: i + 1,
					description: pwDesc[i]
				});
				await extra.save();
			}
		} else {
			const extra = new HomeworkExtra({
				homework: homework._id,
				extraIndex: 1,
				description: ""
			});
			await extra.save();
		}
		req.session.flash = { type: "success", message: [`Homework ${!!req.params.id ? "updated" : "added"}`]};
	} catch (err) {
		console.log(err);
		req.session.flash = { type: "error", message: [`Homework not ${!!req.params.id ? "updated" : "added"}`]};
	} finally {
		res.redirect("/hw/add");
	}
};

export const showHomework =  async (req, res) => { 
	try {
		let homework;
		if (!req.isAuthenticated()) {
		homework = await Homework.find().lean().sort({_id: 1});
		const items = await HomeworkItem
			.aggregate()
			.group({ _id: "$homework", items: { $push: { item: "$_id", itemIndex: "$itemIndex", class: "$class", due: "$due", description: "$description", required: "$required" } } })
			.sort({_id: 1});
		const extras = await HomeworkExtra
			.aggregate()
			.group({ _id: "$homework", extras: { $push: { extra: "$_id", description: "$description" } } })
			.sort({_id: 1});
		for (let i = 0; i < homework.length; i ++) {
			homework[i].items = items[i].items;
			homework[i].extras = extras[i].extras[0].description.length ? extras[i].extras : null;
		}
	} else {
		homework = await HomeworkProgress.find({ user: req.user.id }).populate(['homework', 'itemProgress.item', 'extraProgress.extra']).lean();
		console.log(homework)
	}
	res.render('homework', { homework });
	} catch(err) {
		console.log(err)
		req.session.flash = { type: "error", message: [ err || "Could not display homework."]}
		res.redirect("/profile");
	}
};

export const toggleItem =  async (req, res) => { 
	try {
		await User.toggleItem(req.params.itemId, req.params.hwId, req.user.id);
		res.json("toggled watched");
	} catch (err) {
		console.log(err)
		res.json(err);
	} 
};

export const toggleExtra =  async (req, res) => { 
		try {
		await User.toggleExtra(req.params.itemId, req.params.hwId, req.user.id);
		res.json("toggled watched");
	} catch (err) {
		console.log(err)
		res.json(err);
	} 
};