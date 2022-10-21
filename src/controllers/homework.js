import mongoose from "mongoose";

import { notLoggedIn } from "./auth.js";
import Homework from '../models/Homework.js';
import User from '../models/User.js';
import HomeworkItem from '../models/HomeworkItem.js';
import HomeworkExtra from '../models/HomeworkExtra.js';
import HomeworkProgress from '../models/HomeworkProgress.js';
import ItemProgress from '../models/ItemProgress.js';
import ExtraProgress from '../models/ExtraProgress.js';
import LessonProgress from '../models/LessonProgress.js';

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
		await Homework.findByIdAndUpdate(req.params.id  || mongoose.Types.ObjectId(), hwData, { upsert: true});

		


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
		const submitData = [];
		const itemData = [];
		const extraData = [];
		for (let i = 0; i < Object.keys(data).length; i++) {
			// get each progress item
			const hw = Object.keys(data)[i];
			if (!data[hw] || !(hw in hwData)) continue;
			// if it's submit data
			if (hwData[hw].submit) {
				// get the homework object id and add it to the list
				submitData.push({homework: hwData[hw].hw, user: req.user.id});
			// if it's pushwork data
			} else if (hwData[hw].extra) {
				// get the extra object id and add it to the list
				extraData.push({extra: hwData[hw].item, user: req.user.id});
			// if it's item data
			} else {
				itemData.push({item: hwData[hw].item, user: req.user.id});
			}
		}
		HomeworkProgress.bulkWrite(submitData.map(hw => ({ 
			updateOne: {
				filter: hw,
				update: { submitted: true },
				upsert: true
			} 
		})));
		ItemProgress.bulkWrite(itemData.map(item => ({ 
			updateOne: {
				filter: item,
				update: { done: true },
				upsert: true
			} 
		})));
		ExtraProgress.bulkWrite(extraData.map(extra => ({ 
			updateOne: {
				filter: extra,
				update: { done: true },
				upsert: true
			} 
		})));

		if (req.body.classesWatched || req.body.classesCheckedin) {
			// the object keys from the imported data have the format "hw00-0" and "hw00-s" where 00 is the class number
			// here we extract out the class numbers and figure out which one is the highest
			const classes = new Set();
			Object.keys(data).forEach(key => classes.add(Number(key.split("-")[0].slice(2))));
			const lastClass = Math.max(...classes);

			// once we know which class is the highest, we loop through all the classes up to that one and build the data for bulkwrite
			const classData = [];
			for (let i = 0; i <= lastClass; i++) {
				if (!(i in lessonData)) continue;
				const progress = {};
				if (req.body.classesWatched) progress.watched = true;
				if (req.body.classesCheckedin) progress.checkedIn = true;
				classData.push({lesson: lessonData[i], update: progress})
			}
			LessonProgress.bulkWrite(classData.map(lesson => ({ 
				updateOne: {
					filter: {lesson: lesson.lesson, user: req.user.id},
					update: lesson.update,
					upsert: true
				} 
			})));
			if (req.body.classesWatched) {
				// and we also set the user's current class to be the one after their highest watched
				let currentClass = lastClass + 1;
				const user = await User.findByIdAndUpdate(req.user.id, {
					currentClass: lessonData[currentClass] ? lessonData[currentClass] : null
				});
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
	if (!req.user) return res.status(401).json({msg: "not logged in"});
	try {
		const userId = req.user.id;
		const itemId = req.params.id;
		await ItemProgress.toggleItem(itemId, userId);
		res.json({msg: "toggled hw item"});
	} catch (err) {
		console.log(err)
		res.status(err.status || 500).json({error: err.message});
	} 
};

export const toggleExtra =  async (req, res) => { 
	if (!req.user) return res.status(401).json({msg: "not logged in"});
	try {
		const userId = req.user.id;
		const extraId = req.params.id;
		await ExtraProgress.toggleExtra(extraId, userId);
		res.json({msg: "toggled hw extra"});
	} catch (err) {
		console.log(err);
		res.status(err.status || 500).json({error: err.message});
	} 
};

export const toggleSubmitted =  async (req, res) => { 
	if (!req.user) return res.status(401).json({msg: "not logged in"});
	try {
		const userId = req.user.id;
		const hwId = req.params.id;
		await HomeworkProgress.toggleSubmitted(hwId, userId);
		res.json({msg: "toggled hw submitted"});
	} catch (err) {
		console.log(err);
		res.status(err.status || 500).json({error: err.message});
	} 
};