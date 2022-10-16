import mongoose from "mongoose";

import { notLoggedIn } from "./auth.js";
import Homework from '../models/Homework.js';
import HomeworkItem from '../models/HomeworkItem.js';
import HomeworkExtra from '../models/HomeworkExtra.js';
import HomeworkProgress from '../models/HomeworkProgress.js';
import LessonProgress from '../models/LessonProgress.js';
import { hwData, lessonData } from "../config/importData.js";

export const addEditHomeworkForm = async (req, res) => {
	if (!req.isAuthenticated() || !req.user.admin) return res.redirect("/");
	const edit = !!req.params.id;
	let homework = null;
	if (edit) {
		homework = await Homework.findById(req.params.id).lean();
		const items = await HomeworkItem
			.aggregate()
			.match({ homework: mongoose.Types.ObjectId(req.params.id) })
			.group({ _id: "$homework", items: { $push: { _id: "$_id", class: "$class", description: "$description", required: "$required" } } })
			.sort({_id: 1});
		const extras = await HomeworkExtra
			.aggregate()
			.match({ homework: mongoose.Types.ObjectId(req.params.id) })
			.group({ _id: "$homework", extras: { $push: { _id: "$_id", description: "$description" } } })
			.sort({_id: 1});
		homework.classNo = homework.classNo.join(',');
		homework.items = items[0].items;
		homework.extras = extras.length ? extras[0].extras : [];
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
		const hwRequired = req.body.required ? [].concat(req.body.required) : [];
		let hwId = req.body.hwId ? [].concat(req.body.hwId) : [];
		hwId = hwId.map(id => id === "null" ? null : id);
		const pwDesc = req.body.pwDesc ? [].concat(req.body.pwDesc) : [];
		let pwId = req.body.pwId ? [].concat(req.body.pwId) : [];
		pwId = pwId.map(id => id === "null" ? null : id);
		for (let i = 0; i < hwDesc.length; i++) {
			const item = {
				homework: homework._id,
				class: hwClass[i],
				description: hwDesc[i],
				required: hwRequired[i] === "true" ? true : false,
			};
			await HomeworkItem.findByIdAndUpdate(hwId[i] || mongoose.Types.ObjectId(), item, {upsert: true});
		}
		for (let i = 0; i < pwId.length; i++) {
			const extra = {
				homework: homework._id,
				description: pwDesc[i] || ""
			};
			await HomeworkExtra.findByIdAndUpdate(pwId[i] || mongoose.Types.ObjectId(), extra, {upsert: true});
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
		const homework = await Homework.find().lean().sort({_id: 1});
		const items = await HomeworkItem
			.aggregate()
			.group({ _id: "$homework", items: { $push: { _id: "$_id", class: "$class", due: "$due", description: "$description", required: "$required" } } })
			.sort({_id: 1});
		const extras = await HomeworkExtra
			.aggregate()
			.group({ _id: "$homework", extras: { $push: { _id: "$_id", description: "$description" } } })
			.sort({_id: 1});
		for (let i = 0; i < homework.length; i ++) {
			homework[i].items = items.length ? items[i].items : null;
			homework[i].extras = extras.length && extras[i].extras[0].description.length ? extras[i].extras : null;
		}
	if (req.isAuthenticated()) {
		// combine homework data with user progress for display
		const progress = await HomeworkProgress.find({ user: req.user.id });
		homework.forEach(hw => {
			// check if there is any existing progress for this homework
			const prog = progress.find(p => p.homework.toString() === hw._id.toString())
			hw.submitted = prog ? prog.submitted : false;
			if (prog) {
				// if yes, get item progress
				hw.items.forEach(item => {
					const itemProg = prog.itemProgress?.find(p => p.item.toString() === item._id.toString());
					item.done = itemProg ? itemProg.done : false;
				})
				// if yes and there are extras, get extra progress
				if (hw.extras) {
					hw.extras.forEach(extra => {
						const extraProg = prog.extraProgress?.find(p => p.extra.toString() === extra._id.toString());
						extra.done = extraProg ? extraProg.done : false;
					})
				}
			}
		})
	}
	res.render('homework', { homework });
};

export const importData = async (req, res) => { 
	if (!req.isAuthenticated()) return notLoggedIn(req, res);;
	try {
		const data = JSON.parse(JSON.parse(req.body.import).CBState);
		for (let i = 0; i < Object.keys(data).length; i++) {
			const hw = Object.keys(data)[i];
			if (!data[hw] || !(hw in hwData)) continue;
			if (hwData[hw].submit) {
				await HomeworkProgress.findOneAndUpdate({user: req.user.id, homework: hwData[hw].hw }, { submitted: true }, { upsert: true })
			} else if (hwData[hw].extra) {
				await HomeworkProgress.findOneAndUpdate({user: req.user.id, homework: hwData[hw].hw }, {$push: { extraProgress:{extra: hwData[hw].item, done: true } } }, { upsert: true });
			} else {
				await HomeworkProgress.findOneAndUpdate({user: req.user.id, homework: hwData[hw].hw }, {$push: { itemProgress: {item: hwData[hw].item, done: true }} }, { upsert: true });
			}
		}
		if (req.body.classesWatched || req.body.classesCheckedin) {
			const classes = new Set();
			Object.keys(data).forEach(key => classes.add(Number(key.split("-")[0].slice(2))));
			const lastClass = Math.max(...classes);
			for (let i = 0; i <= lastClass; i++) {
				if (!(i in lessonData)) continue;
				const progress = {};
				if (req.body.classesWatched) progress.watched = true;
				if (req.body.classesCheckedin) progress.checkedIn = true;
				await LessonProgress.findOneAndUpdate({user: req.user.id, lesson: lessonData[i] }, progress, { upsert: true });
			}
		}
		req.session.flash = { type: "success", message: ["Data imported successfully"] };
	} catch (err) {
		console.log(err);
		req.session.flash = { type: "error", message: ["Error importing data"] };
	} finally {
		res.redirect('/account');
	}
};

export const toggleItem =  async (req, res) => { 
	try {
		await HomeworkProgress.toggleItem(req.params.itemId, req.params.hwId, req.user.id);
		res.json("toggled hw item");
	} catch (err) {
		console.log(err)
		res.json(err);
	} 
};

export const toggleExtra =  async (req, res) => { 
		try {
		await HomeworkProgress.toggleExtra(req.params.itemId, req.params.hwId, req.user.id);
		res.json("toggled hw extra");
	} catch (err) {
		console.log(err)
		res.json(err);
	} 
};