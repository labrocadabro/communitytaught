import mongoose from "mongoose";

import { notLoggedIn } from "./auth.js";
import Homework from '../models/Homework.js';
import HomeworkItem from '../models/HomeworkItem.js';
import HomeworkExtra from '../models/HomeworkExtra.js';
import HomeworkProgress from '../models/HomeworkProgress.js';
import ItemProgress from '../models/ItemProgress.js';
import ExtraProgress from '../models/ExtraProgress.js';
import Lesson from '../models/Lesson.js';
import LessonProgress from '../models/LessonProgress.js';
import LessonHwLink from '../models/LessonHwLink.js';

import { hwData, lessonData } from "../config/importData.js";

export const addEditHomeworkForm = async (req, res) => {
	if (!req.isAuthenticated() || !req.user.admin) return res.redirect("/");
	const edit = !!req.params.id;
	let homework = null;
	if (edit) {
		homework = await Homework.findById(req.params.id).lean().populate(["items", "extras"]);
		homework.classNo = homework.classNo.join(',');
	}
	res.render("addHomework", { edit, homework });
};

export const addEditHomework = async (req, res) => {
	if (!req.isAuthenticated() || !req.user.admin) return res.redirect("/");
	try{
		// prepare homework data to be processed
		const hwDesc = req.body.hwDesc ? [].concat(req.body.hwDesc) : [];
		const hwClass = req.body.hwClass ? [].concat(req.body.hwClass) : [];
		const hwRequired = req.body.required ? [].concat(req.body.required) : [];
		let hwId = req.body.hwId ? [].concat(req.body.hwId) : [];
		hwId = hwId.map(id => id === "null" ? null : id);

		// create/update hw items and store ids
		const items = [];
		for (let i = 0; i < hwDesc.length; i++) {
			const item = {
				class: hwClass[i],
				due: req.body.due,
				description: hwDesc[i],
				required: hwRequired[i] === "true" ? true : false,
			};
			const hwItem = await HomeworkItem.findByIdAndUpdate(hwId[i] || mongoose.Types.ObjectId(), item, {upsert: true, new: true});
			console.log(hwItem)
			items.push(hwItem._id);
		}

		// prepare pushwork data to be processed
		const pwDesc = req.body.pwDesc ? [].concat(req.body.pwDesc) : [];
		const pwClass = req.body.pwClass ? [].concat(req.body.pwClass) : [];
		let pwId = req.body.pwId ? [].concat(req.body.pwId) : [];
		pwId = pwId.map(id => id === "null" ? null : id);

		// create/update hw extras and store ids
		const extras = [];
		for (let i = 0; i < pwDesc.length; i++) {
			const extra = {
				class: pwClass[i],
				due: req.body.due,
				description: pwDesc[i] || ""
			};
			const pwItem = await HomeworkExtra.findByIdAndUpdate(pwId[i] || mongoose.Types.ObjectId(), extra, {upsert: true, new: true});
			extras.push(pwItem._id);
		}

		// create/update homework including items and extras
		const hwData = {
			classNo: req.body.number.split(","),
			dueNo: req.body.due,
			submit: req.body.submit,
			cohort: req.body.cohort,
			note: req.body.note,
			items: items,
			extras: extras
		}
		await Homework.findByIdAndUpdate(req.params.id  || mongoose.Types.ObjectId(), hwData, { upsert: true });

		req.session.flash = { type: "success", message: [`Homework ${!!req.params.id ? "updated" : "added"}`]};
	} catch (err) {
		console.log(err);
		req.session.flash = { type: "error", message: [`Homework not ${!!req.params.id ? "updated" : "added"}`]};
	} finally {
		res.redirect("/hw/add");
	}
};

export const getHwProgress = async (userId, homework) => {
		const hwProgress = await HomeworkProgress.find({ user: userId }).lean();
		const hwObj = {};
		hwProgress.forEach(hw => hwObj[hw.homework] = hw.submitted);
		const itemProgress = await ItemProgress.find({ user: userId }).lean();
		const itemObj = {};
		itemProgress.forEach(item => itemObj[item.item] = item.done);
		const extraProgress = await ExtraProgress.find({ user: userId }).lean();
		const extraObj = {};
		extraProgress.forEach(extra => extraObj[extra.extra] = extra.done);
		homework.forEach(hw => {
			hw.submitted = !!hwObj[hw._id];
			hw.items.forEach(item => item.done = !!itemObj[item._id]);
			hw.extras?.forEach(extra => extra.done = !!extraObj[extra._id]);
		});
		return homework;
}

export const showHomework =  async (req, res) => { 
	let homework = await Homework.find().lean().sort({_id: 1}).populate(['items', 'extras']);
	if (req.isAuthenticated()) homework = await getHwProgress(req.user.id, homework);
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
export const linkHwForm =  async (req, res) => { 
	if (!req.isAuthenticated() || !req.user.admin) return res.redirect("/");
	try {
		const lessons = await Lesson.find().lean().sort({ _id: 1 });
		const homework = await Homework.find().lean().sort({ _id: 1 });
		const links = await LessonHwLink.find().lean().sort({ _id: -1 }).populate(['lesson', 'hwAssigned', 'hwDue']);
		res.render('linkHw', { lessons, homework, links });
	} catch (err) {
		console.log(err)
		res.redirect("/");
	} 
};

export const linkHw =  async (req, res) => { 
	if (!req.isAuthenticated() || !req.user.admin) return res.redirect("/");
	try {
		const link = new LessonHwLink({
			lesson: req.body.lesson,
			hwAssigned: req.body.hwAssigned.length ? req.body.hwAssigned : null,
			hwDue: req.body.hwDue.length ? req.body.hwDue : null
		})
		await link.save();
		req.session.flash = { type: "success", message: ["Class and homework linked successfully."]};
	} catch (err) {
		console.log(err)
		req.session.flash = { type: "error", message: ["Class and homework not linked."]};
	} finally {
		res.redirect("/hw/link");
	}
};

export const toggleItem =  async (req, res) => { 
	try {
		await ItemProgress.toggleItem(req.params.id, req.user.id);
		res.json("toggled hw item");
	} catch (err) {
		console.log(err)
		res.json(err);
	} 
};

export const toggleExtra =  async (req, res) => { 
		try {
		await ExtraProgress.toggleExtra(req.params.id, req.user.id);
		res.json("toggled hw extra");
	} catch (err) {
		console.log(err)
		res.json(err);
	} 
};

export const toggleSubmitted =  async (req, res) => { 
		try {
		await HomeworkProgress.toggleSubmitted(req.params.id, req.user.id);
		res.json("toggled hw extra");
	} catch (err) {
		console.log(err)
		res.json(err);
	} 
};