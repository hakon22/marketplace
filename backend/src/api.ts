import express from 'express';
import passport from 'passport';
import Auth from './authentication/Auth.js';
import Activation from './activation/Activation.js';
import Market from './market/Market.js';
import Profile from './profile/Profile.js';

const router = express.Router();

const apiPath = '/marketplace/api';

router.post(`${apiPath}/auth/signup`, Auth.signup);
router.post(`${apiPath}/auth/login`, Auth.login);
router.post(`${apiPath}/auth/recoveryPassword`, Auth.recoveryPassword);
router.post(`${apiPath}/auth/logout`, Auth.logout);
router.get(`${apiPath}/auth/updateTokens`, passport.authenticate('jwt-refresh', { session: false }), Auth.updateTokens);


router.post(`${apiPath}/activation/`, Activation.activation);
router.get(`${apiPath}/activation/:id`, Activation.needsActivation);
router.get(`${apiPath}/activation/repeatEmail/:id`, Activation.repeatEmail);
router.post(`${apiPath}/activation/changeEmail`, Activation.changeEmail);

router.get(`${apiPath}/market/getAll`, Market.getAll);
router.post(`${apiPath}/market/upload`, passport.authenticate('jwt', { session: false }), Market.upload);
router.post(`${apiPath}/market/edit`, passport.authenticate('jwt', { session: false }), Market.edit);
router.delete(`${apiPath}/market/remove`, passport.authenticate('jwt', { session: false }), Market.remove);

router.post(`${apiPath}/profile/confirmEmail`, passport.authenticate('jwt', { session: false }), Profile.confirmEmail);
router.post(`${apiPath}/profile/changeData`, passport.authenticate('jwt', { session: false }), Profile.changeData);

export default router;
