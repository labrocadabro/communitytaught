import Homework from '../models/Homework.js';
import User from '../models/User.js';

export const addHomeworkForm = (req, res) => {
	if (!req.isAuthenticated() || !req.user.admin) return res.redirect("/");
	res.render("addHomework");
};

export const addHomework = async (req, res) => {
	if (!req.isAuthenticated() || !req.user.admin) return res.redirect("/");
	try{
		const hwItems = [];
		const pwItems = [];
		req.body.desc = req.body.desc ? [].concat(req.body.desc) : [];
		req.body.required = req.body.required ? [].concat(req.body.required) : [];
		req.body.extra = req.body.extra ? [].concat(req.body.extra) : [];
		for (let i = 0; i < req.body.desc.length; i++) {
			if (req.body.extra[i] === "true") {
				pwItems.push({
					itemIndex: i,
					description: req.body.desc[i],
					required: req.body.required[i] === "true" ? true : false,
				});
			} else {
				hwItems.push({
					itemIndex: i,
					description: req.body.desc[i],
					required: req.body.required[i] === "true" ? true : false,
				});
			}
		}
		const homework = {
			classNo: req.body.number.split(","),
			dueNo: req.body.due,
			items: hwItems,
			extras: pwItems,
			submit: req.body.submit
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