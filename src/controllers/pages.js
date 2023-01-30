import { notLoggedIn } from "./auth.js";

import Token from "../models/Token.js";
import LessonProgress from "../models/LessonProgress.js";
import Lesson from "../models/Lesson.js";
import Homework from "../models/Homework.js";

import { getHwProgress } from "../controllers/homework.js";
import { getLessonProgress } from "../controllers/lessons.js";

export const index = (req, res) => {
  res.render("index");
};

export const dashboard = async (req, res) => {
  if (!req.isAuthenticated()) return notLoggedIn(req, res);
  let lesson = [];
  if (req.user.currentClass) {
    let currentLesson = await Lesson.findById(req.user.currentClass);
    if(currentLesson) {
    currentLesson = await getLessonProgress(req.user.id, currentLesson);
    lesson.push(currentLesson);
    }
  }
  res.render("dashboard", { lesson });
};

export const account = (req, res) => {
  if (!req.isAuthenticated()) return notLoggedIn(req, res);
  res.render("account");
};

export const login = (req, res) => {
  if (req.isAuthenticated()) res.redirect("/dashboard");
  else res.render("login");
};

export const register = (req, res) => {
  if (req.isAuthenticated()) res.redirect("/dashboard");
  else res.render("register");
};

export const forgot = (req, res) => {
  if (req.isAuthenticated()) res.redirect("/dashboard");
  else res.render("forgot");
};

export const reset = async (req, res) => {
  try {
    if (!req.query.token) return res.redirect("/login");
    const token = await Token.findOne({ token: req.query.token });
    if (!token) {
      req.session.flash = {
        type: "error",
        message: ["Invalid or expired link."],
      };
      return res.redirect("/forgot");
    }
    res.render("reset", { email: token.email, token: token.token });
  } catch (err) {
    console.log(err);
    req.session.flash = { type: "error", message: ["Verification error."] };
    res.redirect("/forgot");
  }
};

export const resources = (req, res) => {
  res.render("resources/index");
};

export const resourcePage = (req, res) => {
  res.render(`resources/${req.params.page}`);
};
