import mongoose from "mongoose";

import Homework from '../models/Homework.js';
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
		const hwItems = [];
		const pwItems = [];
		req.body.hwDesc = req.body.hwDesc ? [].concat(req.body.hwDesc) : [];
		req.body.hwClass = req.body.hwClass ? [].concat(req.body.hwClass) : [];
		req.body.hwDue = req.body.hwDue ? [].concat(req.body.hwDue) : [];
		req.body.required = req.body.required ? [].concat(req.body.required) : [];
		req.body.pwDesc = req.body.pwDesc ? [].concat(req.body.pwDesc) : [];
		req.body.pwClass = req.body.pwClass ? [].concat(req.body.pwClass) : [];
		req.body.pwDue = req.body.pwDue ? [].concat(req.body.pwDue) : [];
		for (let i = 0; i < req.body.hwDesc.length; i++) {
			hwItems.push({
				itemIndex: i + 1,
				class: req.body.hwClass[i],
				due: req.body.hwDue[i],
				description: req.body.hwDesc[i],
				required: req.body.required[i] === "true" ? true : false,
			});
		}
		for (let i = 0; i < req.body.pwDesc.length; i++) {
			pwItems.push({
				itemIndex: i + 1,
				class: req.body.pwClass[i],
				due: req.body.pwDue[i],
				description: req.body.pwDesc[i]
			});
		}
		const homework = {
			classNo: req.body.number.split(","),
			dueNo: req.body.due,
			items: hwItems,
			extras: pwItems,
			submit: req.body.submit,
			cohort: req.body.cohort,
			note: req.body.note
		}
		await Homework.findByIdAndUpdate(req.params.id  || mongoose.Types.ObjectId(), homework, {upsert: true});
		req.session.flash = { type: "success", message: [`Homework ${!!req.params.id ? "updated" : "added"}`]};
	} catch (err) {
		console.log(err);
		req.session.flash = { type: "error", message: [`Homework not ${!!req.params.id ? "updated" : "added"}`]};
	} finally {
		res.redirect("/hw/add");
	}
};

export const showHomework =  async (req, res) => { 
	const homework = await Homework.find().lean();
	if (req.isAuthenticated()) {
		const user = await User.findById(req.user.id);
		homework.map(hw => {
			const hwProgress = user.hwProgress.find(progress => {
				return progress.hwId.toString() === hw._id.toString();
			})
			if (hwProgress) {
				hw.items.map(item => {
					const itemProgress = hwProgress.items.find(progress => {
						return progress.itemId.toString() === item._id.toString();
					});
					if (itemProgress) {
						item.done = itemProgress.done;
					} else {
						item.done = false;
					}
					return item;
				});
				if (hw.extras) {
					const extraProgress = hw.extras.map(extra => {
						hwProgress.extras.find(progress => {
							return progress.extraId.toString() === extra._id.toString();
						});
						if (extraProgress) {
							extra.done = extraProgress.done;
						} else {
							extra.done = false;
						}
						return extra;
					});
				}	
			} else {
				if (hw.extras) {
					hw.items.map(item => {
						item.done = false;
					});

					const extras = hw.extras.map(extra => {
						extra.done = false;
					});
				}
			}	
			return hw;
		})
	}
	res.render('homework', { homework });
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