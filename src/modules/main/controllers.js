export const index = (req, res) => {
	res.render("index");
};

export const about = (req, res) => {
	res.render("about");
};

export const resources = (req, res) => {
	res.render("resource/index");
};

export const resourcePage = (req, res) => {
	res.render(`resource/${req.params.page}`);
};
